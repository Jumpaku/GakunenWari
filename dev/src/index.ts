import {  View } from "./view";
import { Payment, PaymentData } from "./payment";

const gradeNames = ["1年", "2年", "3年", "4年", "M1", "M2", "D"];
const initData: Readonly<PaymentData> = {
    counts: gradeNames.map(_ => 0),
    total: 0,
    diffParam: 0,
    trancate: 50
}
const model = new Payment(initData);
const view = new View(gradeNames, model);

window.onload = () => {
    view.initialize();
    console.log(model);
    console.log(view);
};
