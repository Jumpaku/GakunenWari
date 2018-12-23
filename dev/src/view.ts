import { PaymentData, PaymentResult, Payment } from "./payment";

export type InputEvent = Event & { target: HTMLInputElement }

function handler(f: (e: InputEvent) => void): { handleEvent: (e: InputEvent) => void } {
    return {
        handleEvent: f
    }
}

export class View {
    
    private gradeNames: ReadonlyArray<string>;

    private payment: Readonly<Payment>;

    constructor(gradeNames: ReadonlyArray<string>, payment: Readonly<Payment>) {
        this.gradeNames = [...gradeNames];
        this.payment = payment;
    }

    private total_field(): HTMLInputElement {
        return document.querySelector("#total_field") as HTMLInputElement;
    }
    private max_fraction_field(): HTMLInputElement {
        return document.querySelector("#max_fraction_field") as HTMLInputElement;
    }
    private diff_parameter_slider(): HTMLInputElement {
        return document.querySelector("#diff_parameter_slider") as HTMLInputElement;
    }
    private diff_value(): HTMLOutputElement {
        return document.querySelector("#diff_value") as HTMLOutputElement;
    }
    private participants_counts_field(gradeIndex: number) : HTMLInputElement {
        return document.querySelector("#participants_counts_field" + gradeIndex) as HTMLInputElement;
    }
    private payment_amount(gradeIndex: number) : HTMLOutputElement {
        return document.querySelector("#payment_amount" + gradeIndex) as HTMLOutputElement;
    }
    private output_remainder(): HTMLOutputElement {
        return document.querySelector("#output_remainder_text") as HTMLOutputElement;
    }

    initialize() {
        this.build_input_participants();
        this.addEventListeners();
    }

    private build_input_participants() {
        const input_participants = document.querySelector("#input_participants") as HTMLDivElement;
        const template = document.querySelector("#participants_data_template") as HTMLTemplateElement;
        this.gradeNames.forEach((gradeName, index) => {
            const clone = document.importNode(template.content, true);
            const conatiner = clone.querySelector("div")!;
            const divs = conatiner.querySelectorAll("div");
            const gradeText = divs[0];
            gradeText.textContent = gradeName;
            gradeText.id = "grade_name" + index;
            const participants_counts_field = divs[1].children[0] as HTMLInputElement;
            participants_counts_field.id = "participants_counts_field" + index;
            const output = divs[2].children[0] as HTMLOutputElement;
            output.id = "payment_amount" + index;
            input_participants.appendChild(conatiner);
        });
    }

    private addEventListeners() {
        const parse = (n: string): number => n.match(/^\d{1,9}$/) === null ? 0 : parseInt(n)
        this.total_field().addEventListener("change", handler(
            e => this.update({ total: parse(e.target.value) })));
        this.max_fraction_field().addEventListener("change", handler(
            e => this.update({ trancate: parse(e.target.value) })));
        this.diff_parameter_slider().addEventListener("input", handler(
            e => this.updateAndCompute({ diffParam: parse(e.target.value) })));
        this.gradeNames.forEach((_, index) => this.participants_counts_field(index).addEventListener("change", handler(
            e => this.updateAndCompute({ counts: this.payment.data.counts.map(
                (c, i) => i === index ? parse(e.target.value) : c)}))));
    }

    private update(updateData: Partial<PaymentData>) {
        const validated = this.validateData(updateData);
        const { data, } = this.payment.update(updateData);
        this.showData(Object.assign(data, { diffParamMax: validated.diffParamMax }));
    }

    private updateAndCompute(updateData: Partial<PaymentData>) {
        const validated = this.validateData(updateData);
        const { data, result } = this.payment.update(updateData);
        this.showData(Object.assign(data, { diffParamMax: validated.diffParamMax }));
        this.showResult(data, result);
    }

    private showData(data: Readonly<PaymentData> & { diffParamMax: number }) {
        this.total_field().value = data.total.toString();
        this.max_fraction_field().value = data.trancate.toString();
        data.counts.forEach((c, i) => this.participants_counts_field(i).value = c.toString());
        this.diff_parameter_slider().max = data.diffParamMax.toString();
        this.diff_value().textContent = (data.trancate*data.diffParam).toString();
    }

    private showResult(paymentData: Readonly<PaymentData>, paymentResult: Readonly<PaymentResult>) {
        if (paymentResult.wasComputed) {
            paymentResult.payments.forEach((payment, gradeIndex) => {
                const payment_amount = this.payment_amount(gradeIndex);
                if (paymentData.counts[gradeIndex] > 0) {
                    payment_amount.textContent = payment.toString();  
                }
                else {
                    payment_amount.textContent = "0";  
                }
            });
            this.output_remainder().textContent = paymentResult.remainder.toString();
        }
    }

    private validateData(data: Partial<PaymentData>): Readonly<PaymentData> & { diffParamMax: number } {
        const prev = this.payment.data;
        const counts = (data.counts !== undefined ? data.counts : prev.counts)
            .map(c => Math.max(0, c));
        const total = Math.max(0, 
            (data.total !== undefined ? data.total : prev.total));
        const trancate = Math.max(1,
            (data.trancate !== undefined ? data.trancate : prev.trancate));
        const C = counts.map((c, i) => i*c).reduce((a, b) => a + b);
        const diffParamMax = Math.floor(total/(trancate*C));
        const diffParam = Math.min(0, Math.max(diffParamMax, 
            (data.diffParam !== undefined ? data.diffParam : prev.diffParam)));
        return {
            total: total,
            counts: counts,
            trancate: trancate,
            diffParam: diffParam,
            diffParamMax: diffParamMax
        };
    }
}

