$(document).ready(function () {

function tagAdded(data){
    console.log(data);
    var id = $(this).attr('id');
    var val = data.addedInput.text;
    var input = data.context[0].id + ' input';
}

$('#email-tags').tagThis({
    email : true,
    noDuplicates : true,
    callbacks: {
        afterAddTag : tagAdded
    }
});


});