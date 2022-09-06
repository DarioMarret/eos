export function compare_lname(a, b) {
    if (a.lname.toLowerCase() < b.lname.toLowerCase()) {
        return -1;
    }
    if (a.lname.toLowerCase() > b.lname.toLowerCase()) {
        return 1;
    }
}