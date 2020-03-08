const THREE = require('three');

class AFrameObj{
    constructor(params){
        this.element = document.getElementById(params.id);
        this.worldPosition = new THREE.Vector3();
        if(params.movable){
            this.movable = params.movable;
        }
    }

    __setAttribute__(params){
        this.element.setAttribute(params.attrName,params.attr);
    }

    updatePosition(){
        this.element.object3D.getWorldPosition(this.worldPosition);
    }

    moveObject({newPos=this.worldPosition,dur="1500", easing="linear", elasticity="400"} = {}){
        if(!this.movable) {
            throw "Object not movable";
        }
        this.__setAttribute__({
            attrName:"animation",
            attr:"property: position; to:"+newPos.x+" "+newPos.y+" "+newPos.z+"; dur: "+dur+"easing: "+easing+"; elasticity: "+elasticity
        });
    }

    trackReference(reference,distance,{interval="5"}={})
    {
        this.trackInterval = setInterval(() =>{
            reference.updatePosition();
            const referencePos = reference.worldPosition;
            const multiplier =(referencePos.y-1.6<0)?-1:1;
            const newX = referencePos.x * distance;
            const newZ = referencePos.z *distance;
            const newY = Math.sqrt(distance**2-newX**2-newZ**2) * multiplier;
            const newPos={
                x:newX,
                y:newY+1.6,
                z:newZ
            }
            this.moveObject({
                newPos:newPos,
                dur:"0",
                elasticity:0
            });
        },interval);
    }
}
const obj = new AFrameObj({id:"redCube", movable:true});
const crosshair = new AFrameObj({id:"cursor"});
obj.trackReference(crosshair, 3);