$(document).ready(()=>
{
    let $list=$(".list");
    let $rightbar=$(".excercises");
    let $leftbar=$(".trainings");
    clickAdd();
    startTraining();

    function clickAdd() {
        $(".addEx").on("click", function () {//по замерам должно быть максимум 7 упражнений
            let text=$(".ex").val();
            $list.prepend("<div class='newExc'><button class='delEx'>Del</button> </div>");
            $(".newExc").text(text);
            $rightbar.prepend("<div class='excercise'><input type='checkbox' class='checkbox'> <div class='task'></div><button class='del'>Del</button> </div>");
            $(".task").text(text);
            text.val("");
        })
    }

    function startTraining() {
        $(".startbtn").on("click", function (){
            $(".starttraining").hide(1000);
            $(".fon").hide(1000);
            $(".left").show(2000);
            $(".right").show(2000);
            $leftbar.prepend("<div class='trainday'></div>");


        })

    }

});