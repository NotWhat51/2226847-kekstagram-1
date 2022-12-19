import { renderPicture} from "./render.js";
import { getData } from "./api.js";
import { showWarning } from "./util.js";
import './upload_image.js';

getData((posts) => {
        for (const post of posts) {
            renderPicture(post);
        };
    },
    () => {
        showWarning('Failed to load data. Try to reload the page', 0);
    }
);