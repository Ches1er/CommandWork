"use strict";

class ExcerToLocalStorage{
    init(){
        this.excercizes = $(".exercize");
        this.events();
    }

    events(){
        $("button").on("click",(e)=>{
            ExcerToLocalStorage.count(this.excercizes);
        })
    }

    static count(ex){
        let percentPerTask = 100/ex.length;
        let sumPercent = 0;
        let excercise = {Done:[],excerUnit:[],sumPerc:""};
        for (let i=0;i<ex.length;i++){
            if (ex[i].children[0].checked){
                excercise.Done[i]=1;
                excercise.excerUnit[i]=ex[i].children[1].innerText;
                excercise.sumPerc = sumPercent+=percentPerTask
            }
            else {
                excercise.Done[i]=0;
                excercise.excerUnit[i]=ex[i].children[1].innerText;
                excercise.sumPerc = sumPercent;
            }
        }
        ExcerToLocalStorage.putToTheLocalStorage(excercise);
    }

    static putToTheLocalStorage(excercise){
        let excerJSON = JSON.stringify(excercise);
        localStorage.setItem("201018",excerJSON);
    }
}

let $percent = new ExcerToLocalStorage()
$(document).ready(()=>{
    $percent.init();
});