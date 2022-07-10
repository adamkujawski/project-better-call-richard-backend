import {NextFunction, Request, Response, Router} from "express";
import {loginValidation, signupValidation} from "../utils/middleware/user";
import {pool} from "../utils/db";
import bcrypt from "bcrypt";
import {FieldPacket} from "mysql2";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
}

type UserRestults = [UserInterface[], FieldPacket[]];

export const loginRouter = Router()
    .post(
        "/register",
        signupValidation,
        async (req: Request, res: Response, next: NextFunction) => {
            const [results] = await pool.execute(
                "SELECT * FROM `user` WHERE 'email'=:email",
                {
                    email: req.body.email,
                }
            ) as UserRestults;
            console.log(results)
            console.log(req.body.email)
            if (results.length) {
                return res.status(409).send({
                    msg: "This user is already in use!",
                });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err,
                        });
                    } else {
                        try {
                            // has hashed pw => add to database
                            console.log(req.body.name,req.body.email,hash)
                            await pool.execute(
                                //name, email, password
                                "INSERT INTO `user` VALUES (:id, :name, :email, :password, :last_login)",
                                {
                                    id: uuid(),
                                    name: req.body.name,
                                    email: req.body.email,
                                    password: hash,
                                    last_login: new Date(),
                                }
                            );
                            console.log(req.body.name,req.body.email,hash)

                            return res.status(201).send({
                                msg: "The user has been registerd with us!",
                            });
                        } catch (err) {
                            throw err;
                            return res.status(400).send({
                                msg: err,
                            });
                        }
                    }
                });
            }
        }
    )
    .post(
        "/login",
        loginValidation,
        async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body.email,req.body.password)
            try {
                const [results] = await pool.execute("SELECT * FROM `user` WHERE `email` = :email ",
                    {
                        email: req.body.email,
                    }
                ) as UserRestults;
                await console.log(results)
                if (!results.length) {
                    return res.status(401).send({
                        msg: "Email or password is incorrect!",
                    });
                }
                // check password
                bcrypt.compare(
                    req.body.password,
                    results[0]["password"],
                    async (bErr, bResult) => {
                        // wrong password
                        if (bErr) {
                            throw bErr;
                            return res.status(401).send({
                                msg: "Email or password is incorrect!",
                            });
                        }
                        if (bResult) {
                            const token = jwt.sign(
                                {id: results[0].id},
                                "the-super-strong-secrect",
                                {expiresIn: "1h"}
                            );
                            await pool.execute(
                                "UPDATE `user` SET `last_login` = :last_login WHERE `id` = :id",
                                {
                                    last_login: new Date(),
                                    id: results[0].id,
                                }
                            );
                            return res.status(200).send({
                                msg: "Logged in!",
                                token,
                                user: results[0],
                            });

                        }
                        return res.status(401).send({
                            msg: "Username or password is incorrect!",
                        });
                    }
                );
            } catch (err) {
                throw err;
                return res.status(400).send({
                    msg: err,
                });
            }
        }
    )
    .post("/get-user", signupValidation, async (req: Request, res: Response, next: NextFunction) => {
            if (
                !req.headers.authorization ||
                !req.headers.authorization.startsWith("Bearer") ||
                !req.headers.authorization.split(" ")[1]
            ) {
                return res.status(422).json({
                    message: "Please provide the token",
                });
            }
            const theToken = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(theToken, "the-super-strong-secrect") ;
            try{
                const [results] = await pool.query(
                    "SELECT * FROM 'users' where `id` =:id",{
                        id:  (<any>decoded).id,
                    }
                ) as UserRestults;

                return res.send({
                    error: false,
                    data: results[0],
                    message: "Fetch Successfully.",
                });
            }
           catch(err){
               throw err;
           }

        }
    );
