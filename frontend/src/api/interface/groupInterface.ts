export interface Group {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    createdDate: string; // Use `Date` if you plan to parse it into a Date object
    creatorId: string;
    members: string[];
}

export interface ExpenseShare {
    amount: number;
    userId: string;
}

export interface GroupExpense {
    id: string;
    shares: ExpenseShare[];
    amount: number;
    createdDate: string; // Use `Date` if you plan to parse it into a Date object
    paidBy: string;
    description: string | null; // Can be null
}