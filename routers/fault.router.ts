import {Router} from "express";
import {Fault} from "../records/fault.record";

export const FaultRouter = Router()
    .get("/", async (req, res) => {
        const faults = await Fault.getAllFaults();
        res.json(faults);
    })

    .get("/new", async (req, res) => {
        const getNew = await Fault.getNewFaults();
        res.json(getNew);
    })

    .get("/waiting", async (req, res) => {
        const getWaiting = await Fault.getWaitingFaults();
        res.json(getWaiting);
    })

    .get("/finished", async (req, res) => {
        const getFinished = await Fault.getFinishedFaults();
        res.json(getFinished);
    })
    .get("/accepted", async (req, res) => {
        const getFinished = await Fault.getAcceptedFaults();
        res.json(getFinished);
    })
    .get("/status/:code", async (req, res) => {
        const statusFault = await Fault.getOneWithCode(req.params.code);
        res.json(statusFault.status)
    })
    .patch("/finish/:id", async (req, res) =>
    {
        const finishFault = await Fault.getOneWithId(req.params.id);
        await finishFault.finishStatus();
        res.json(finishFault.id)
    })
    .get("/:id", async (req, res) => {
        const getOne = await Fault.getOneWithId(req.params.id);
        res.json(getOne);
    })

    .get("/code/:code", async (req, res) => {
        const getOne = await Fault.getOneWithCode(req.params.code);
        res.json(getOne);
    })

    .patch("/:id", async (req, res) => {
        const fault = await Fault.getOneWithId(req.params.id);
        await fault.addPricing(req.body.pricing, req.body.arrivalDate);
        res.json(fault);
    })

    .get("/accept/:id", async (req, res) => {
        const fault = await Fault.getOneWithId(req.params.id);
        console.log(fault);
        await fault.changeStatus();
        res.send("<h1>Dziękuje za akceptacje! Czekam na Twój przyjazd</h1>");
    })

    .post("/", async (req, res) => {
        const newFaut = await new Fault(req.body);
        console.log(req.body)
        console.log("jestem tu")
        await newFaut.addNewFault();
        res.send(newFaut);
    })

