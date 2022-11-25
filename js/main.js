import { createPublication } from "./data.js";
import { renderPicture} from "./render.js";

const posts = createPublication();
renderPicture(posts);