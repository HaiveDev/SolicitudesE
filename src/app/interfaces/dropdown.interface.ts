export interface Dropdown {
    name: string;
    code: string;
    subdata?: string;
}

export interface ResponseDataDropdown {
    count?:         number | null;
    next?:          string | null;
    previous?:      string | null;
    results:        ResultsResponseDataDropdown[];
}

export interface ResultsResponseDataDropdown {
    id:            number;
    active:        boolean;
    created_at:    string;
    last_modified: string;
    nombre:        string;
    added_by:      string | null;
}
