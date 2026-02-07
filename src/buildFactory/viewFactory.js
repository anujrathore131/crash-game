import * as Pixi from "pixi.js";
export default class ViewFactory {
     createView(json){
        const elements = new Map();
        for(const key in json){
            const node = json[key];
            const displayObject = this.createElement(node);
            elements.set(node.id,displayObject);
        }

        let root = null;
        for(const key in json){
            const node = json[key];
            const displayObject = elements.get(node.id);

            if(node.parent){
                elements.get(node.parent).addChild(displayObject);
            }
            else{
                root = displayObject;
            }
        }
        return {root,elements}

    }

    createElement(node){
        let obj;
        switch (node.type){
            case "Sprite":
                obj =  Pixi.Sprite.from(Pixi.Assets.get(node.image));
                break
            case  "Container":
                obj =  new Pixi.Container();
                break
        }
        obj.x = node.x ?? 0;
        obj.y = node.y ?? 0;
        obj.scale.set(node.scale ?? 1);
        obj.anchor = node.anchor ?? 0.5;
        obj.visible = node.visible ?? true;
        obj.name = node.id ?? "";
        return obj;
    }
} 