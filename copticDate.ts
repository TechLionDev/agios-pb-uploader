import PocketBase from "pocketbase";
import fs from "fs";
var data = JSON.parse(fs.readFileSync("DATA.json", "utf8"));

var pb = new PocketBase("https://agios-calendar.pockethost.io");

for (let i = 0; i < data.length; i++) {
    let dateStr = data[i].copticDate;
    let month = dateStr.split(" ")[0];
    let day = dateStr.split(" ")[1];
    await pb.collection("copticDate").create({
        month: month,
        day: day,
        // The following needs to be a DATE object starting from May 9, 2024 increasing EXACTLY by 1 day each time the loop iterates
        gregorianDate: new Date(2024, 4, 9 + i),
    });
    console.log(`Added ${month} ${day}!`);
}