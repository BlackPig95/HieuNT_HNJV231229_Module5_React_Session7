/**
 * Support format money as Vietnamese currency
 * @param {*} money: The number that needs to be formatted
 * @returns The formatted number 
 */
const handleFormatMoney = (money) =>
{
    return money.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};
export { handleFormatMoney };