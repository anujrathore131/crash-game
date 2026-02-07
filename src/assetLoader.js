import {Assets} from "pixi.js"
export default class AssetLoader {

    static async init(){
        const keys = this.registerAllFiles();
        await Assets.load(keys);
    }
    static registerAllFiles(){
        const images = import.meta.glob(
            "../assets/**/*.{png,webp,jpg}",
            {eager:true}
        )
        let arr = []
        for(const path in images){
            const key = path.split("/").pop();
            arr.push(key);
            Assets.add({alias:key,src:path});
        }
        return arr;
    }
}