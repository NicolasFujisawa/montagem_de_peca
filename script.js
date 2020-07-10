const THREE = require('three');

class AFrameObj{
    constructor(id,{size={x:1,y:1,z:1},movable=false,yOffSet=1.6} = {}){
        this.element = document.getElementById(id);
        this.worldPosition = new THREE.Vector3();
        this.size = size;
        this.yOffSet = yOffSet;
        this.movable = movable
    }

    __setAttribute__(params){
        this.element.setAttribute(params.attrName,params.attr);
    }

    updatePosition(){
        this.element.object3D.getWorldPosition(this.worldPosition);
    }

    moveObject({newPos=this.worldPosition,dur=1500, easing="linear", elasticity="400"} = {}){
        if(!this.movable){
            throw "Object not movable";
        }
        this.__setAttribute__({
            attrName:"animation",
            attr:"property: position; to:"+newPos.x+" "+newPos.y+" "+newPos.z+"; dur: "+dur+"easing: "+easing+"; elasticity: "+elasticity
        });
    }

    rotateObject({newRotation = {x:0,y:0,z:0}} = {}){
        if(!this.movable){
            throw "Object not movable";
        }
        this.__setAttribute__({
            attrName:"rotation",
            attr:newRotation.x+" "+newRotation.y+" "+newRotation.z
        });
    }

    trackReference(reference,distance,{interval=5,rotationOffSet=245, preventTracking=true}={})
    {
        if(reference.isTracking) return false;
        this.trackInterval = setInterval(() => {
            reference.updatePosition();
            const referencePos = reference.worldPosition;
            const multiplier =(referencePos.y-reference.yOffSet<0)?-1:1;
            const newX = referencePos.x * distance;
            const newZ = referencePos.z * distance;
            const newY = Math.sqrt(distance**2-newX**2-newZ**2) * multiplier;

            const rad = Math.atan2(newX,newZ);
            const deg = rad * (180/Math.PI);

            const newPos={
                x:newX,
                y:newY+this.yOffSet,
                z:newZ
            }

            const newRotation={
                x:0,
                y:deg-rotationOffSet,
                z:0
            }

            this.moveObject({
                newPos:newPos,
                dur:0,
                elasticity:0
            });

            this.rotateObject({newRotation:newRotation});
            this.updatePosition();
        },interval);
        reference.isTracking = preventTracking;
        return true;
    }

    stopTracking(reference){
        if(this.trackInterval != null){
            clearInterval(this.trackInterval);
            reference.isTracking = false;
            return true;
        }
        return false;
    }

    onSelect(cursor, {ticks=0} = {}){
        this.selectInterval = setInterval(() => {
            if(ticks === 3 && this.onSelectFunction){
                const result = this.onSelectFunction();
                if(result){
                    clearInterval(this.selectInterval);
                }
            }
            this.updatePosition();
            cursor.updatePosition();
            const multiplier =(cursor.worldPosition.y-cursor.yOffSet<0)?-1:1;
            const distance = Math.sqrt((this.worldPosition.x-cursor.worldPosition.x)**2 +
                                       (this.worldPosition.z-cursor.worldPosition.z)**2);

            const drawnPointX = cursor.worldPosition.x * distance;
            const drawnPointZ = cursor.worldPosition.z * distance;
            const drawnPointY = Math.sqrt(distance**2-drawnPointX**2-drawnPointZ**2) * multiplier + this.yOffSet;

            if(this.worldPosition.x <= drawnPointX+this.size.x && this.worldPosition.x >= drawnPointX-this.size.x &&
            this.worldPosition.z <= drawnPointZ+this.size.z && this.worldPosition.z >= drawnPointZ-this.size.z &&
            this.worldPosition.y <= drawnPointY+this.size.y && this.worldPosition.y >= drawnPointY-this.size.y){
                ticks+=1;
            }else ticks = 0;
        },250);
    }
}

const peca1 = new AFrameObj("peca1",{movable:true,size:{x:1,z:1,y:3},yOffSet:0.75});
const peca2 = new AFrameObj("peca2",{movable:true,size:{x:1,z:1,y:3},yOffSet:0});
const peca3 = new AFrameObj("peca3",{movable:true,size:{x:1,z:1,y:3},yOffSet:0});
const porta = new AFrameObj("porta",{size:{x:2,z:2,y:5}});

const textBox = new AFrameObj("text-box",{movable:true});
const crosshair = new AFrameObj("cursor");

//textBox.trackReference(crosshair,1,{yOffSet:1.8,preventTracking:false,rotationOffSet:180});

peca1.onSelectFunction = () =>{
    return peca1.trackReference(crosshair,2.5);
}
peca2.onSelectFunction = () =>{
    return peca2.trackReference(crosshair,2.5);
}
peca3.onSelectFunction = () =>{
    return peca3.trackReference(crosshair,2.5);
}

porta.onSelectFunction = () =>{
    if(peca1.stopTracking(crosshair)){
            peca1.rotateObject({
                newRotation:{
                    x:0,
                    z:0,
                    y:315
                }
            });

            peca1.moveObject({
                newPos:{
                    x:-0.2,
                    y:0.3,
                    z:-2.7
                },
                dur:500
            });
    }

    if(peca2.stopTracking(crosshair)){
        peca2.moveObject({
            newPos:{
                x:-0.2,
                y:0.3,
                z:-2.7
            },
            dur:500
        });
    }
    if(peca3.stopTracking(crosshair)){
        peca3.moveObject({
            newPos:{
                x:-0.2,
                y:0.3,
                z:-2.7
            },
            dur:500
        });
    }
    return false;
}

peca1.onSelect(crosshair);
peca2.onSelect(crosshair);
peca3.onSelect(crosshair);

porta.onSelect(crosshair,{
    ticks:-2
});
lixeira.onSelect(crosshair,{
    ticks:-7
});