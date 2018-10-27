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

    //Считаем процент выполнения + формируем объект значений

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

    //Получаем дату в удобном для нас формате

    static getDate(){
        let dateOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }
        let date = new Date().toLocaleString("ru", dateOptions);
        return date;
    }

/*    Пушим объект значений на Локал Сторадж и вызываем функции для
    формирования правого и левого блоков*/

    static putToTheLocalStorage(excercise){
        let index = new Date();
        let excerJSON = JSON.stringify(excercise);
        localStorage.setItem(index,excerJSON);
        ExcerToLocalStorage.addTrainingToTheLeftBlock(excercise,index);
        ExcerToLocalStorage.addTrainingToTheRightBlock(excercise)
    }

    //Формируем правый блок

    static addTrainingToTheRightBlock(obj){

        //Чистим предыдущие значения

        let $excercisesPrev=$(".container>.excercises")
        $excercisesPrev.remove();

        //Создаем новые поля

        let $excercisesNext = $("<div class='excercises'>")
        let $excerciseDate = $("<p class='training_date'>")
        let $excercisePerc = $("<p class='training_perc'>")
        $excerciseDate.text(obj.date);
        $excercisePerc.text("Ваша тренировка выполнена на: " + obj.sumPerc + "%");
        $excercisesNext.append($excerciseDate,$excercisePerc);

        for (let i=0;i<obj.Done.length;i++){

            //Create fields

            let $excercise = $("<div class='excercise'>");
            let $image = $("<div class='done_img'>");
            let $task = $("<div class='task'>");

            //Fill in fields

            if (obj.Done[i]===1)$image.css("backgroundImage","url(http://www.pkicon.com/icons/7447/Checkmark-256.png)")
            else  $image.css("backgroundImage","url(http://cs5-1.4pda.to/1141855.png)")

            $task.text(obj.excerUnit[i]);

            //Append

            $excercise.append($image,$task);
            $excercisesNext.append($excercise);
        }

        $(".container").prepend($excercisesNext);
    }

    //Добавляем тренировку в левый блок

    static addTrainingToTheLeftBlock(exc,index){
        let $leftBlockExc = $("<div class='trainings'>")
        $leftBlockExc.data("index",index);
        let $leftBlockExcPerc = $("<p>");
        let $leftBlockExcDate = $("<p>");
        $leftBlockExcDate.text(exc.date)
        $leftBlockExcPerc.text(exc.sumPerc+"%");
        $leftBlockExc.append($leftBlockExcDate,$leftBlockExcPerc);
        $(".left_block").append($leftBlockExc);

        //Activate left block

        let $excFromLocal = new ExcerFromLocalStorage()
        $excFromLocal.init();

    }
}

/*Выводим тренировку из Local Storage и отправляем результаты в правый блок*/

class ExcerFromLocalStorage{

    init(){
        this.$trainings = $(".trainings")
        this.event(this.$trainings.data("index"));
    }

    event(index){
        this.$trainings.on("click",(e)=>{
            console.log(ExcerFromLocalStorage.getFromLocalStorage(index));
        })
    }

    static getFromLocalStorage(index){
        let trainingUnit = JSON.parse(localStorage.getItem(index));
        return trainingUnit;
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
let addDel = new addDelExcercise();

$(document).ready(()=>{
    addExc.init();
    excToLocal.init();
    addDel.init();
})
