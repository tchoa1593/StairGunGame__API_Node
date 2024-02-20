"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../../app/controllers");
router.get('/', controllers_1.ItemController.getAll);
router.post('/buy', controllers_1.ItemController.buy);
router.post('/sell', controllers_1.ItemController.sellItem);
exports.default = router;
