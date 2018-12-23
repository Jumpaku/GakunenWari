
export interface PaymentData {
    counts: ReadonlyArray<number>;
    total: number;
    diffParam: number;
    trancate: number;
}

export type PaymentResult = { wasComputed: false } | {
    wasComputed: true;
    payments: ReadonlyArray<number>;
    remainder: number;
}

export class Payment {

    constructor (paymentData: Readonly<PaymentData>) {
        this._data = paymentData;
    }

    private _data: Readonly<PaymentData>;
    get data(): Readonly<PaymentData> {
        return this._data;
    }

    update(data: Partial<PaymentData>): Readonly<{
        data: Readonly<PaymentData>, result: Readonly<PaymentResult>
    }> {
        this._data = {
            total: data.total !== undefined ? data.total : this._data.total,
            diffParam: data.diffParam !== undefined ? data.diffParam : this._data.diffParam,
            trancate: data.trancate !== undefined ? data.trancate : this._data.trancate,
            counts: data.counts !== undefined ? data.counts : this._data.counts
        };
        return {
            data: this._data,
            result: this.isComputable(this._data) ?
            { wasComputed: false } : this.computePayment(this._data)
        }
    }

    /**
     * Computes x_i and r.
     * b is a given parameter defines d.
     * t is tortal payment.
     * u is tracate unit.
     * d = b*u is difference of payment.
     * i is integer value of grade.
     * c_i is count of participants who are i-th grade.
     * n = sum of c_i is count of all participants.
     * C = sum of i*c_i is count of all weighted participants counts.
     * a = (t - r - b*u*C)/(n*u) is 
     * x_i = a*u + i*d is payment of a participant who is i-th grade.
     */
    private computePayment(data: Readonly<PaymentData>): Readonly<PaymentResult> {
        const b = data.diffParam;
        const total = data.total;
        const unit = data.trancate;
        const counts = data.counts;
        const participantsCount = counts.reduce(plus);
        if (participantsCount == 0 || unit == 0) {
            return {
                wasComputed: true,
                payments: data.counts.map(_ => 0),
                remainder: total
            };
        }
        const C = counts.map((c, i) => c*i).reduce(plus);
        const remainder = (total - b*unit*C) % (participantsCount*unit);
        const a = (total - remainder - b*unit*C)/(participantsCount*unit);
        const payments = data.counts.map((_, i) => a*unit + i*b*unit);
        return {
            wasComputed: true,
            payments: payments,
            remainder: remainder
        };
    }

    private isComputable(data: Readonly<PaymentData>): boolean {
        return data.total <= 0 ||
            data.trancate <= 0 ||
            data.diffParam < 0 ||
            data.counts.map(c => c < 0).reduce((a, b) => a || b)
    }
}

const plus = (a: number, b: number) => a + b;
