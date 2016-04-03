// Write any custom javascript functions here
var $window = $(window)
var $document = $(document)


/*This function is position indicator*/
$document.ready(function () {
    var homeDistance = $("#Home").offset().top;
    var aboutDistance = $("#About").offset().top - $(window).height() / 2;
    var ideaDistance = $("#Ideas").offset().top- $(window).height() / 2;
    var introDistance = $("#Intro").offset().top - $(window).height() / 2;
    var teamDistance = $("#Team").offset().top - $(window).height() / 2;
    $window.scroll(function () {
        var CurrentPosition = $document.scrollTop();
        if (CurrentPosition > homeDistance && CurrentPosition <= aboutDistance)
            $("#HomeButton").addClass("success");
        else
            $("#HomeButton").removeClass("success");
        if (CurrentPosition > aboutDistance && CurrentPosition <= ideaDistance)
            $("#AboutButton").addClass("success");
        else
            $("#AboutButton").removeClass("success");
        if (CurrentPosition > ideaDistance && CurrentPosition <= introDistance)
            $("#IdeasButton").addClass("success");
        else
            $("#IdeasButton").removeClass("success");
        if (CurrentPosition > introDistance && CurrentPosition <= teamDistance)
            $("#IntroButton").addClass("success");
        else
            $("#IntroButton").removeClass("success");
        if (CurrentPosition > teamDistance)
            $("#TeamButton").addClass("success");
        else
            $("#TeamButton").removeClass("success");
    })
});
