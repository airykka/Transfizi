'use strict';

const finalObj = [];
const basicBlock = {
  name: 'Noji',
  description:
    'Bibinii; A new era is here. Our instruments are ready, we are gathered. We beat our drums. Now you can listen to the rhythm and sway our way. Wotè!',
  image: 'https://s3.amazonaws.com/noji.so/000.jpg',
};

for (let i = 0; i < 3000; i++) {
  const newObj = {
    name: `${basicBlock.name} #${i}`,
    description: basicBlock.description,
    image: basicBlock.image,
  };

  finalObj.push(newObj);
}
console.log(finalObj);
