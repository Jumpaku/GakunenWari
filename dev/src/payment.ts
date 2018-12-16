
interface DataIthGrade {
    count: number;
    payment: number;
}

interface PaymentData {
    dataIthGrade: ReadonlyArray<DataIthGrade>;
    totalPayment: number;
    differenceParameter: number;
    trancate: number;
}

function createPaymentData(data: Partial<PaymentData> = {}): Readonly<PaymentData> {
    return {
        totalPayment: data.totalPayment || 0,
        differenceParameter: data.differenceParameter || 0,
        trancate: data.trancate || 50,
        dataIthGrade: data.dataIthGrade || [
            { count: 0, payment: 0 },
            { count: 0, payment: 0 },
            { count: 0, payment: 0 },
            { count: 0, payment: 0 },
            { count: 0, payment: 0 },
            { count: 0, payment: 0 }
        ]
    };
}

interface PaymentResult {
    paymentsIthGrade: ReadonlyArray<number>;
    remainder: number;
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
 * r_0 = t % (n*u) is the first remainder.
 * r_1 = (b*(sum of (i*c_i))) % n is second remainder.
 * a = (t - r0)/(n*u) - (b*(sum of (i*c_i)) - r1)/n is 
 * x_i = a*u + i*d is payment of a participant who is i-th grade.
 * r = t - (sum of (x_i*c_i))
 */
function computePayment(data: PaymentData): Readonly<PaymentResult> | undefined {
    const plus = (a: number, b: number) => a + b;
    const b = data.differenceParameter;
    const total = data.totalPayment;
    const unit = data.trancate;
    const diff = b*unit;
    const counts = data.dataIthGrade.map(r => r.count);
    const participantsCount = counts.reduce(plus);
    if (participantsCount == 0) {
        return undefined;
    }
    const r0 = total % (participantsCount*unit);
    const tmp = b*counts.map((c, i) => c*i).reduce(plus)
    const r1 = tmp % participantsCount;
    const a = ((total - r0)/unit - (tmp - r1))/participantsCount;
    const payments = data.dataIthGrade.map((_, i) => a*unit + i*diff);
    const r = total - payments.map((p, i) => p*counts[i]).reduce(plus);
    return {
        paymentsIthGrade: data.dataIthGrade.map((row, i) => payments[i]),
        remainder: r
    }
}
