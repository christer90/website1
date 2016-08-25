"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var AppComponent = (function () {
    function AppComponent(http) {
        this.http = http;
        this.websiteResponseArray = [];
        this.abcNewsArray = [];
        this.cnnNewsArray = [];
        this.cnnEntertainmentArray = [];
        this.bbcTechArray = [];
    }
    AppComponent.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
    };
    AppComponent.prototype.getFeed = function (website, url) {
        var _this = this;
        this.http.get(url)
            .subscribe(function (data) { return _this.addDataToList(website, data["_body"]); }, function (err) { return _this.logError(err.text()); }, function () { return console.log(); });
    };
    AppComponent.prototype.addDataToList = function (website, data) {
        var allWebsites = [];
        var mData = data;
        allWebsites.push(website, mData);
        this.websiteResponseArray.push(allWebsites);
        this.extractNews(website, mData);
    };
    AppComponent.prototype.runAllRequests = function () {
        this.getABCNews();
        this.getCnnNews();
        this.getCnnEntertainment();
        this.getBBCTech();
    };
    AppComponent.prototype.getABCNews = function () {
        this.getFeed('abcnews', 'http://feeds.abcnews.com/abcnews/topstories');
    };
    AppComponent.prototype.getCnnNews = function () {
        this.getFeed('cnnnews', 'http://rss.cnn.com/rss/edition.rss');
    };
    AppComponent.prototype.getCnnEntertainment = function () {
        this.getFeed('cnnentertainment', 'http://rss.cnn.com/rss/edition_entertainment.rss');
    };
    AppComponent.prototype.getBBCTech = function () {
        this.getFeed('bbctech', 'http://feeds.bbci.co.uk/news/technology/rss.xml');
    };
    AppComponent.prototype.extractNews = function (website, data) {
        if (website == 'abcnews') {
            this.extractABC(data);
        }
        else if (website == 'cnnnews') {
            this.extractCNN(data);
        }
        else if (website == 'cnnentertainment') {
            this.extractCNNEntertainment(data);
        }
        else if (website == 'bbctech') {
            this.extractBBCTech(data);
        }
    };
    AppComponent.prototype.extractABC = function (data) {
        var itemArray = this.extractItem(data);
        this.extractABCNewsUtils(itemArray);
    };
    AppComponent.prototype.extractCNN = function (data) {
        var itemArray = this.extractItem(data);
        this.extractCNNNewsUtils(itemArray);
    };
    AppComponent.prototype.extractCNNEntertainment = function (data) {
        var itemArray = this.extractItem(data);
        this.extractCNNEntertainmentUtils(itemArray);
    };
    AppComponent.prototype.extractBBCTech = function (data) {
        var itemArray = this.extractItem(data);
        this.extractBBCTechUtils(itemArray);
    };
    AppComponent.prototype.extractItem = function (data) {
        var count = (data.match(/<item>/g) || []).length;
        var startValue = 0;
        var itemArray = [];
        var itemStart = 0;
        var itemEnd = 0;
        var itemString = "";
        var startPunkt = 0;
        for (var i = 0; i < count; i++) {
            itemString = "";
            itemStart = data.indexOf("<item>", startPunkt);
            itemEnd = data.indexOf("</item>", itemStart);
            for (itemStart; itemStart < itemEnd; itemStart++) {
                itemString += data.charAt(itemStart);
                startPunkt = itemStart;
            }
            itemArray.push(itemString);
        }
        return itemArray;
    };
    AppComponent.prototype.extractABCNewsUtils = function (itemArray) {
        for (var i = 0; i < itemArray.length; i++) {
            var title = "";
            var description = "";
            var image = "";
            var link = "";
            var category = "";
            title = this.getTextBetween("<title>", "</title>", itemArray[i]);
            title = title.replace("<title><![CDATA[ ", "");
            title = title.replace("]]>", "");
            description = this.getTextBetween("<description>", "</description>", itemArray[i]);
            description = description.replace("<description><![CDATA[", "");
            description = description.replace("]]>", "");
            //get image
            image = this.getLastOfManyTags("<media:thumbnail url", ".jpg", itemArray[i]);
            link = this.getTextBetween("<link>", "</link>", itemArray[i]);
            link = link.replace("<link><![CDATA[", "");
            link = link.replace("]]>", "");
            category = this.getTextBetween("<category>", "</category>", itemArray[i]);
            category = category.replace("<category>", "");
            this.abcNewsArray.push({ Title: title, Description: description, Image: image, Link: link, Category: category });
        }
        console.log(this.abcNewsArray);
    };
    AppComponent.prototype.extractCNNNewsUtils = function (itemArray) {
        for (var i = 0; i < itemArray.length; i++) {
            var title = "";
            var description = "";
            var image = "";
            var link = "";
            var category = "";
            title = this.getTextBetween("<title>", "</title>", itemArray[i]);
            title = title.replace("<title><![CDATA[", "");
            title = title.replace("]]>", "");
            description = this.getTextBetween("<description>", "</description>", itemArray[i]);
            description = description.replace("<description><![CDATA[", "");
            description = description.replace("]]>", "");
            //get image
            image = this.getTextBetween('media:content medium="image" url=', '" height=', itemArray[i]);
            image = image.replace('media:content medium="image" url="', "");
            link = this.getTextBetween("<link>", "</link>", itemArray[i]);
            link = link.replace("<link>", "");
            link = link.replace("]]>", "");
            category = this.getTextBetween("<category>", "</category>", itemArray[i]);
            category = category.replace("<category>", "");
            this.cnnNewsArray.push({ Title: title, Description: description, Image: image, Link: link, Category: 'news' });
        }
        console.log(this.cnnNewsArray);
    };
    AppComponent.prototype.extractCNNEntertainmentUtils = function (itemArray) {
        for (var i = 0; i < itemArray.length; i++) {
            var title = "";
            var description = "";
            var image = "";
            var link = "";
            var category = "";
            title = this.getTextBetween("<title>", "</title>", itemArray[i]);
            title = title.replace("<title><![CDATA[", "");
            title = title.replace("]]>", "");
            description = this.getTextBetween("<description>", "</description>", itemArray[i]);
            description = description.replace("<description>", "");
            description = description.substring(0, description.indexOf('&lt;img'));
            //get image
            image = this.getTextBetween('<media:content', '" height', itemArray[i]);
            image = image.replace('<media:content medium="image" url="', "");
            link = this.getTextBetween("<link>", "</link>", itemArray[i]);
            link = link.replace("<link>", "");
            link = link.replace("]]>", "");
            category = this.getTextBetween("<category>", "</category>", itemArray[i]);
            category = category.replace("<category>", "");
            this.cnnEntertainmentArray.push({ Title: title, Description: description, Image: image, Link: link, Category: 'entertainment' });
        }
        console.log(this.cnnEntertainmentArray);
    };
    AppComponent.prototype.extractBBCTechUtils = function (itemArray) {
        for (var i = 0; i < itemArray.length; i++) {
            var title = "";
            var description = "";
            var image = "";
            var link = "";
            var category = "";
            title = this.getTextBetween("<title>", "</title>", itemArray[i]);
            title = title.replace("<title><![CDATA[", "");
            title = title.replace("]]>", "");
            description = this.getTextBetween("<description>", "</description>", itemArray[i]);
            description = description.replace("<description>", "");
            description = description.replace('<![CDATA[', "");
            description = description.replace(']]>', "");
            //description = description.substring(0, description.indexOf('&lt;img'));
            //get image
            image = this.getTextBetween('media:thumbnail', '/>', itemArray[i]);
            image = image.split('url="').pop();
            image = image.replace('"', "");
            link = this.getTextBetween("<link>", "</link>", itemArray[i]);
            link = link.replace("<link>", "");
            this.bbcTechArray.push({ Title: title, Description: description, Image: image, Link: link, Category: 'tech' });
        }
        console.log(this.bbcTechArray);
    };
    AppComponent.prototype.getTextBetween = function (text1, text2, data) {
        var itemStart = 0;
        var itemEnd = 0;
        var startPoint = 0;
        var endPoint = 0;
        var itemText = "";
        itemStart = data.indexOf(text1, startPoint);
        itemEnd = data.indexOf(text2, itemStart);
        for (itemStart; itemStart < itemEnd; itemStart++) {
            itemText += data.charAt(itemStart);
        }
        return itemText;
    };
    AppComponent.prototype.getLastOfManyTags = function (startText, endText, itemArray) {
        var mString = startText;
        var regString = "" + startText;
        var re = new RegExp(regString, 'g');
        var mStringCount = (itemArray.match(re) || []).length;
        var mImageStart = 0;
        var mImageEnd = 0;
        var image = "";
        for (var j = 0; j < mStringCount; j++) {
            image = "";
            mImageStart = itemArray.indexOf(startText, mImageStart);
            mImageEnd = itemArray.indexOf(endText, mImageStart);
            for (mImageStart; mImageStart < mImageEnd; mImageStart++) {
                image += itemArray.charAt(mImageStart);
            }
        }
        var formatedImage = image.replace('<media:thumbnail url="', "");
        formatedImage += ".jpg";
        return formatedImage;
    };
    AppComponent.prototype.setAttributeWhenSafari = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
            if (ua.indexOf('chrome') > -1) {
            }
            else {
                document.getElementById("safari_text1").setAttribute("class", "safari_text");
                document.getElementById("safari_text2").setAttribute("class", "safari_text");
            }
        }
    };
    AppComponent.prototype.repositionFBLogin = function () {
        document.getElementById('fb1login').appendChild(document.getElementById('fbloginbtn'));
    };
    AppComponent.prototype.ngOnInit = function () {
        this.repositionFBLogin();
        this.setAttributeWhenSafari();
        this.runAllRequests();
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.css'],
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
platform_browser_dynamic_1.bootstrap(AppComponent, [http_1.HTTP_PROVIDERS]);
//# sourceMappingURL=app.component.js.map