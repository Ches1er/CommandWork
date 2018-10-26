"use strict";

//Добавляем упражнения в план тренировок

class AddExc{

    init(){
        this.$addExcInput = $(".ex");
        this.$addExcButton = $(".addEx")
        this.count = 0;
        this.events();
    }

    events(){
        this.$addExcButton.on("click",(e)=>{
            this.count++;
            this.addExcToAddExcUnit(this.$addExcInput.val(),this.count)
        })

    }

    addExcToAddExcUnit(value, count){
        if (count<8){
            let $excBlock = $("<div class='excBlock'>");
            $excBlock.text(value);
            $(".list").append($excBlock);

        }
        else{
            alert("Вам достаточно упражнений");
            this.$addExcButton.css("display","none")
        }
    }

}

/*Добавляем тренировку на Local Storage и формируем
ее вывод в левый блок */

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

/*Выводим тренировку из Local Storage и выводим в
правый блок  */

class ExcerFromLocalStorage{

    init(){

    }

}

/*Добавление-удаление тренировок*/

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


let addExc = new AddExc();
let excToLocal = new ExcerToLocalStorage()
let excFromLocal = new ExcerFromLocalStorage()
let addDel = new addDelExcercise();

$(document).ready(()=>{
    addExc.init();
    excToLocal.init();
    excFromLocal.init();
    addDel.init();
})
