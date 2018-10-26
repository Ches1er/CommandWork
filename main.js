"use strict";

class ExcerToLocalStorage{
    init(){
        this.excercises = $(".excercise");
        this.events();
    }

    events(){
        $(".save").on("click",(e)=>{
            ExcerToLocalStorage.count(this.excercises);
        })
    }

    static count(ex){
        let percentPerTask = 100/ex.length;
        let sumPercent = 0;
        let excercise = {date:"",Done:[],excerUnit:[],sumPerc:""};
        excercise.date =ExcerToLocalStorage.getDate();
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

    static getDate(){
        let dateOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }
        let date = new Date().toLocaleString("ru", dateOptions);
        return date;
    }

    static putToTheLocalStorage(excercise){
        let index = new Date();
        let excerJSON = JSON.stringify(excercise);
        localStorage.setItem(index,excerJSON);
    }
}

class addDelExcercise {

    init(){
        this.addButton = $(".add");
        this.delButton = $(".del");
        this.addExcInput = $(".addExc");
        this.events();
    }

    events(){
        this.addButton.on("click",(e)=>{
            addDelExcercise.addExcercise(this.addExcInput)
        })
    }

    static addExcercise(elem){
        let $excDiv = $("<div class='excercise'>");
        let $task = $("<div class='task'>")
        $task.text(elem.val());
        $excDiv.append("<input type='checkbox'>",$task)
        $(".save").before($excDiv);
    }
}

let $percent = new ExcerToLocalStorage()
let $addDel = new addDelExcercise();
$(document).ready(()=>{
    $percent.init();
    $addDel.init();
});