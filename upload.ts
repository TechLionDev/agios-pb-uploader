import fs from "fs";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://agios-calendar.pockethost.io");

async function uploadImagesToPocketBase() {
  const allLocalImages = fs.readdirSync("images");
  for (const image of allLocalImages) {
    const formData = new FormData();
    const file = fs.readFileSync(`images/${image}`);

    // Extract caption from the filename at the last period
    const lastPeriodIndex = image.lastIndexOf(".");
    const caption = image.slice(0, lastPeriodIndex);

    let existsInPB = await pb
    .collection("icons")
    .getFirstListItem(`caption="${caption}"`, {
      expand: "iconographer"
    })
    .catch((err) => {
      return;
    });

    if (existsInPB) {
      console.log(`Image ${caption} already exists in PocketBase. Skipping...`);
      continue;
    }
    
    // Append the image file to the FormData
    formData.append("image", new Blob([file]), image);

    // Append other fields if needed
    formData.append("caption", caption);

    try {
      // Upload image using PocketBase
      const createdRecord = await pb.collection("icons").create(formData);
      console.log(`Image ${caption} uploaded successfully!`);
      console.log("Created Record:", createdRecord);
    } catch (error) {
      console.error(`Error uploading image ${caption}: ${error}`);
    }
  }
}

uploadImagesToPocketBase();
// let collection = "copticDate"
// let recs = await pb.collection(collection).getFullList();

// for (let i = 0; i < recs.length; i++) {
//     let rec = recs[i];
//   console.log(`${i+1}/${recs.length}: Deleting ${rec.month+' '+rec.day}...`);
//   await pb.collection(collection).delete(rec.id);
//   await new Promise((resolve) => setTimeout(resolve, 1000));
// }
