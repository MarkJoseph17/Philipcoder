"use strict";

class ViewCourseManager {
    constructor(theUser,courseid){
        this.theUser = theUser;
        this.courseid = courseid;

        this.viewcoursesinfo(courseid);

        // This reads the current courses from the database and
        // adds them to the UI so we can see them.
        var courseclassesRef = firebase.database().ref('_course_class_list/' + this.courseid + '/classes');
        courseclassesRef.once('value', (snapshot) => {
            let classes = snapshot.val();
            if (classes) {
                for (let id in classes) {
                let classe = classes[id];
                this.insertClassInTable(id, classe);
                }
                // This required to make the UI look correctly by Material Design Lite
                componentHandler.upgradeElements(document.getElementById('class-container'));
            }
        });
    }

    viewcoursesinfo(courseid){
        var courseRef = firebase.database().ref('courses/'+courseid);
            courseRef.once('value', (snapshot) => {

            let course = snapshot.val();
            this.insertCourseInfo(course);
                /*if (courses) {
                for (let id in courses) {
                    let course = courses[id];
                    insertCourseInfo(id, course);
                }
                }*/
        });
    }

    insertCourseInfo(course) {
        var list = $('.courseinfo-cont').append(
        `<div class="col-md-1"></div>
        <div class="col-md-3" style="margin-bottom:5px;">
            <img src="${ course.imageurl }" class="img-thumbnail" alt="" width="300px" height="300px;">
        </div>
        <div class="col-md-7">
            <div id="courseid_${course.key}" class="jumbotron" style="padding:20px; border-radius: 0px; background-color: transparent;">
            <h1 class="display-4">${ course.title }</h1>
            <p class="lead">T${ course.description }</p>
            <hr class="my-4">
            <a class="btn btn-primary btn-lg btnlearnmore" href="#" role="button" style="border-radius:0px;">Learn more</a>
            </div>
        </div>
        <div class="col-md-1"></div>`);
    }

    insertClassInTable(classid, classe){
        var list = $('.flex-container').append(
            `<div class="demo-card-square mdl-card mdl-shadow--2dp" id="courseid_${classid}">
                <div class="mdl-card__title mdl-card--expand" data-imgname="${ classe.image_name }" data-imgurl="${ classe.image_url }" style="background: url('${ classe.image_url }'); background-position: center; background-repeat: no-repeat; background-size: cover;">
                    <h2 class="mdl-card__title-text course-title">${ classe.title }</h2>
                </div>
                <div class="mdl-card__supporting-text course-des">
                ${ classe.description }
                </div>
                <div class="mdl-card__actions mdl-card--border">
                    <a href="#" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect take-course">
                        Take this class
                    </a>
                </div>
            </div>`);
    }

}