export interface Job {
    id: string;
    content: string;
    imagePath: string;
    creator: string;
    state: string;
    substate: string;
    jobType: string[];
    address: string;
}

export const STATES = ['new','open','pending','closed']
export const SUBSTATES = ['new','cancelled','closed complete','closed incomplete']
export const JOBTYPES = ['Handyman', 'Landscape', 'Plumming', 'Remodeling', 'Roofing', 'Electrical'];

