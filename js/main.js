import { setOfPublication } from "./data.js";
import { renderPicture} from "./render.js";
import './upload_image.js';

const posts = setOfPublication();

for (const post of posts) {
    renderPicture(post);
}