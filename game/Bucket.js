export default class Bucket {
  constructor(manager, numObjects) {
    this.manager = manager;
    this.objects = [];
    this.numObjects = numObjects

    this.createObjects();
  }


  createObjects() {
    for (let i = 0; i < this.numObjects; i++) {
      this.objects.push(this.createObject());
    }
  }


  createObject() {

  }


  getObject() {
      let obj = this.objects.pop();
      if (!obj) {
        obj = createObject();
      }
      obj.visible = true;
      return obj;
  }


  returnObject(obj) {
    obj.visible = false;
    this.objects.push(obj);
  }
}
