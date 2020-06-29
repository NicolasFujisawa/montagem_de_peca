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

    trackReference(reference,distance,{interval=5}={})
    {
        this.trackInterval = setInterval(() => {
            reference.updatePosition();
            const referencePos = reference.worldPosition;
            const multiplier =(referencePos.y-1.6<0)?-1:1;
            const newX = referencePos.x * distance;
            const newZ = referencePos.z * distance;
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
            this.updatePosition();
        },interval);
    }

    stopTracking(){
        if(this.trackInterval != null){
            clearInterval(this.trackInterval);
            return true;
        }
        return false;
    }

    onSelect(cursor, size, func, {ticks=0} = {}){
        this.selectInterval = setInterval(() => {
            if(ticks === 3){
                const result = func();
                if(result){
                    clearInterval(this.selectInterval);
                }
                console.log(result);
            }
            this.updatePosition();
            cursor.updatePosition();
            const multiplier =(cursor.worldPosition.y-1.6<0)?-1:1;
            const distance = Math.sqrt((this.worldPosition.x-cursor.worldPosition.x)**2 +
                                       (this.worldPosition.z-cursor.worldPosition.z)**2);

            const drawnPointX = cursor.worldPosition.x * distance;
            const drawnPointZ = cursor.worldPosition.z * distance;
            const drawnPointY = Math.sqrt(distance**2-drawnPointX**2-drawnPointZ**2) * multiplier + 1.6;

            if(this.worldPosition.x <= drawnPointX+size && this.worldPosition.x >= drawnPointX-size &&
            this.worldPosition.z <= drawnPointZ+size && this.worldPosition.z >= drawnPointZ-size &&
            this.worldPosition.y <= drawnPointY+size && this.worldPosition.y >= drawnPointY-size){
                ticks+=1;
            }else ticks = 0;
        },250);
    }
}

const redObj = new AFrameObj({id:"redCube", movable:true});
const blueObj = new AFrameObj({id:"blueCube", movable:true});
const crosshair = new AFrameObj({id:"cursor"});

redObj.onSelect(crosshair,1,() =>{
    redObj.trackReference(crosshair,3);
    return true;
});

blueObj.onSelect(crosshair,1,() =>{
    if(redObj.stopTracking()){
        redObj.moveObject({
            newPos:{
                x:1,
                y:1,
                z:-3
            }
        });
    }
});