import PocketBase, { type RecordModel } from "pocketbase";
import fs from "fs";
var data = JSON.parse(fs.readFileSync("DATA.json", "utf8"));

var pb = new PocketBase("https://agios-calendar.pockethost.io");

await pb.autoCancellation(false);

async function findImage(name: string) {
  let existsInPB = await pb
    .collection("icons")
    .getFirstListItem(`caption="${name}"`, {
      expand: "iconographer"
    })
    .catch((err) => {
      return;
    });
  return existsInPB;
}

async function findImages(names: string[]) {
  let images = [];
  for (let name of names) {
    images.push(findImage(name));
  }
  return Promise.all(images);
}

async function main(data: any, i: number) {
  let numImages = data.classicSaintIcon.length;
  let images: any[] = []; // Initialize the 'images' variable with an empty array
  if (numImages == 1) {
    images = [await findImage(data.classicSaintIcon[0])];
  } else if (numImages > 1) {
    images = await findImages(data.classicSaintIcon);
    images = images.filter((image) => image !== undefined);
  } else {
    console.log("No images to find");
  }

  let copticDateJSON = data.copticDate;
  let copticDatePB = await pb
    .collection("copticDate")
    .getFirstListItem(
      `month="${copticDateJSON.split(" ")[0]}" && day="${
        copticDateJSON.split(" ")[1]
      }"`
    )
    .catch((err) => {
      return;
    });
  await pb.collection("occasion").create({
    icons: images.length > 1 ? images.map((image) => image.id) : images[0]?.id,
    copticDate: copticDatePB?.id,
    date: new Date(2023, 8, 1 + i),
    name: data.feastName,
    liturgicalInformation: data.liturgicalInformation
  });
}

for (let i = 0; i < data.length; i++) {
  try {
    main(data[i], i);
  } catch (error) {}
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
