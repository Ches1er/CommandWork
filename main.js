"use strict";

//Добавляем упражнения в план тренировок

class AddExc{

    init(){
        this.$addExcInput = $(".ex");
        this.$addExcButton = $(".addEx");
        this.count = 0;
        this.events();
        this.hideAndShow()
    }

    events(){
        this.$addExcButton.on("click",(e)=>{
            this.count++;
            this.addExcToAddExcUnit(this.$addExcInput.val(),this.count)
        })

    }

    //Добавляем упражнения в стартовую тренировку

    addExcToAddExcUnit(value, count){
        if (count<8){
            let $excBlock = $("<div class='excBlock'>");
            $excBlock.text(value);
            $(".list").append($excBlock);
            AddExc.formEx(value);
            this.$addExcInput.val("")
        }
        else{
            alert("Вам достаточно упражнений");
            this.$addExcButton.css("display","none")
        }
    }

    //Прячем меню ввода и показуем основную страницу

    hideAndShow(){
        $(".start").on("click",()=>{
            $(".fon").hide(1000);
            $(".starttraining").hide(1000);
            $(".right").show(2000);
            $(".left").show(2000);

            //Активируем добавление основной расчет % выполнения и добавление упражнения на Локал Сторадж

            let excToLocal = new ExcerToLocalStorage();
            excToLocal.init();
        })
    }

    // Добавляем блоки упражнений в правый блок

    static formEx(value){
        let $excercise = $("<div class='excercise'>");
        let $checkbox = $("<input type='checkbox'>");
        let $task = $("<div class='task'>");
        let $del_button = $("<button class='del'>Del</button>")
        $task.text(value);
        $excercise.append($checkbox,$task,$del_button);
        $(".excercises").append($excercise);
    }

}

/*Добавляем тренировку на Local Storage и формируем
ее вывод в левый блок */

class ExcerToLocalStorage{
    init(){
        this.events();
    }

    events(){
        $(".save").on("click",()=>{
            ExcerToLocalStorage.count($(".excercise"));
            })
    }

    //Считаем процент выполнения + формируем объект значений

    static count(ex){
        let percentPerTask = Math.floor(100/ex.length);
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
        };
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

        let $excercisesPrev=$(".excercises");
        $excercisesPrev.remove();

        //Создаем новые поля

        let $excercisesNext = $("<div class='excercises'>")
        let $excerciseDate = $("<p class='training_date'>")
        let $excercisePerc = $("<p class='training_perc'>")
        $excerciseDate.text(obj.date);
        $excercisePerc.text("Ваша тренировка выполнена на: " + obj.sumPerc + "%");
        $excercisesNext.append($excerciseDate,$excercisePerc);

        for (let i=0;i<obj.Done.length;i++){

            //Создаем поля упражнений
            let $excercise = $("<div class='excercise'>");
            let $image = $("<div class='done_img'>");
            let $task = $("<div class='task'>");

            //Заполняем поля

            if (obj.Done[i]===1)$image.css("backgroundImage","url(http://www.pkicon.com/icons/7447/Checkmark-256.png)");
            else  $image.css("backgroundImage","url(http://cs5-1.4pda.to/1141855.png)");

            $task.text(obj.excerUnit[i]);

            //Append

            $excercise.append($image,$task);
            $excercisesNext.append($excercise);
        }
        $(".right").append($excercisesNext);

    }

    //Добавляем тренировку в левый блок

    static addTrainingToTheLeftBlock(exc,index){
        let $leftBlockExc = $("<div class='trainings'>");
        $leftBlockExc.attr("index",index);
        $leftBlockExc.text(exc.date+ ": " + exc.sumPerc+"%")
        $(".left_block").append($leftBlockExc);

        //Activate left block

        let $excFromLocal = new ExcerFromLocalStorage();
        $excFromLocal.event();

        let newTraining = new addNewTraining();
        newTraining.init(index);
    }
}

/*Выводим тренировку из Local Storage и отправляем результаты в правый блок*/

class ExcerFromLocalStorage{

    event(){
        $(".trainings").on("click",(e)=>{
            let index = e.target.getAttribute("index");
            ExcerFromLocalStorage.getFromLocalStorage(index);
        })
    }

    static getFromLocalStorage(index){
        let trainingUnit = JSON.parse(localStorage.getItem(index));
        ExcerToLocalStorage.addTrainingToTheRightBlock(trainingUnit)
    }
}

/*Добавление-удаление упражнений*/

class addDelExcercise {

    init(){
        this.addButton = $(".add");
        this.addExcInput = $(".addExc");
        this.events();
    }

    events(){
        this.addButton.on("click",(e)=>{
            addDelExcercise.addExcercise(this.addExcInput)
        });
        //удаляем упражнение
        $(".excercises").on("click",".del",(e)=>{
            let delblock=e.target.parentNode;
            delblock.remove();
        })
    }

    static addExcercise(elem){
        let $excDiv = $("<div class='excercise'>");
        let $task = $("<div class='task'>");
        let $btn=$("<button class='del'>Del</button>");
        $task.text(elem.val());
        $excDiv.append("<input type='checkbox'>",$task,$btn);
        $(".addAndSave").after($excDiv);//добавить новое упр в конец списка
        elem.val("");

    }
}

/*Добавление новой тренировки*/

class addNewTraining{
    init(index){
        this.event(index);
    }
    event(index){
        $(".newTraining").on("click",(e)=>{
            let $excercisesPrev=$(".excercises");
            $excercisesPrev.remove();
            addNewTraining.rightBarNewTraining(index);
        })
    }
    static rightBarNewTraining(index){
        let $rightBarTraining = $("<div class='excercises'>");
        let $addAndSave = $("<div class='addAndSave'>");
        $addAndSave.append('<input type="text" class="addExc" placeholder="добавить новое упражнение">',
            '<button class="add">Добавить</button>','<button class="save">Сохранить тренировку</button>')
        $rightBarTraining.append($addAndSave);
        $(".right").append($rightBarTraining);

        let trainingUnit = JSON.parse(localStorage.getItem(index));
        for (let i=0;i<trainingUnit.Done.length;i++){
            AddExc.formEx(trainingUnit.excerUnit[i]);
        }

/*        Заново инициируем классы удаления-добавления упражнений
        и добавления тренировки на сервер*/

        let addDel = new addDelExcercise();
        addDel.init();
        let excToLocal = new ExcerToLocalStorage();
        excToLocal.init();
    }
}


let addExc = new AddExc();
let addDel = new addDelExcercise();

$(document).ready(()=>{
    addExc.init();
    addDel.init();
});
