import { Component, AfterViewInit } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {Http, Headers, HTTP_PROVIDERS} from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})

export class AppComponent {

  responseData: string;
  jsonObject: string;
  websiteResponseArray = [];
  abcNewsArray = [];
  cnnNewsArray = [];
  cnnEntertainmentArray = [];
  bbcTechArray = [];

  constructor(public http: Http) {

  }

  logError(err) {
    console.error('There was an error: ' + err);
  }

  getFeed(website, url) {
    this.http.get(url)
    .subscribe(
      data => this.addDataToList(website, data["_body"]),
      err => this.logError(err.text()),
      () => console.log()
    );
  }

  private addDataToList(website, data){
    var allWebsites = [];
    var mData = data;
    allWebsites.push(website, mData);
    this.websiteResponseArray.push(allWebsites);
    this.extractNews(website, mData);
  }

  private runAllRequests(){
    this.getABCNews();
    this.getCnnNews();
    this.getCnnEntertainment();
    this.getBBCTech();
  }

  private getABCNews(){
    this.getFeed('abcnews', 'http://feeds.abcnews.com/abcnews/topstories');
  }
  private getCnnNews(){
    this.getFeed('cnnnews', 'http://rss.cnn.com/rss/edition.rss');
  }
  private getCnnEntertainment(){
    this.getFeed('cnnentertainment', 'http://rss.cnn.com/rss/edition_entertainment.rss');
  }
  private getBBCTech(){
    this.getFeed('bbctech', 'http://feeds.bbci.co.uk/news/technology/rss.xml');
  }
  private extractNews(website, data){
    if(website == 'abcnews'){
      this.extractABC(data);
    }else if(website == 'cnnnews'){
      this.extractCNN(data);
    }else if(website == 'cnnentertainment'){
      this.extractCNNEntertainment(data);
    }else if(website == 'bbctech'){
      this.extractBBCTech(data);
    }
  }
  private extractABC(data){
    var itemArray = this.extractItem(data);
    this.extractABCNewsUtils(itemArray);
  }
  private extractCNN(data){
    var itemArray = this.extractItem(data);
    this.extractCNNNewsUtils(itemArray);
  }
  private extractCNNEntertainment(data){
    var itemArray = this.extractItem(data);
    this.extractCNNEntertainmentUtils(itemArray);
  }
  private extractBBCTech(data){
    var itemArray = this.extractItem(data);
    this.extractBBCTechUtils(itemArray);
  }

  private extractItem(data){
    var count = (data.match(/<item>/g) || []).length;
    var startValue = 0;
    var itemArray = [];
    var itemStart = 0;
    var itemEnd = 0;
    var itemString = "";
    var startPunkt = 0;

    for(var i = 0; i < count; i++){
      itemString = "";
      itemStart = data.indexOf("<item>", startPunkt);
      itemEnd = data.indexOf("</item>", itemStart);

      for(itemStart; itemStart < itemEnd; itemStart++){
        itemString += data.charAt(itemStart);
        startPunkt = itemStart;
      }
      itemArray.push(itemString);
    }
    return itemArray;
  }

  private extractABCNewsUtils(itemArray){

    for(var i = 0; i < itemArray.length; i++){
      var title = "";
      var description = "";
      var image = "";
      var link = "";
      var category = "";

      title = this.getTextBetween("<title>","</title>",itemArray[i]);
      title = title.replace("<title><![CDATA[ ", "");
      title = title.replace("]]>", "");

      description = this.getTextBetween("<description>","</description>",itemArray[i]);
      description = description.replace("<description><![CDATA[", "");
      description = description.replace("]]>", "");
      //get image
      image = this.getLastOfManyTags("<media:thumbnail url", ".jpg", itemArray[i]);

      link = this.getTextBetween("<link>","</link>",itemArray[i]);
      link = link.replace("<link><![CDATA[", "");
      link = link.replace("]]>", "");

      category = this.getTextBetween("<category>","</category>",itemArray[i]);
      category = category.replace("<category>", "");

      this.abcNewsArray.push({Title: title, Description: description, Image: image, Link: link, Category: category});
    }
    console.log(this.abcNewsArray);
  }

  private extractCNNNewsUtils(itemArray){

    for(var i = 0; i < itemArray.length; i++){
      var title = "";
      var description = "";
      var image = "";
      var link = "";
      var category = "";

      title = this.getTextBetween("<title>","</title>",itemArray[i]);
      title = title.replace("<title><![CDATA[", "");
      title = title.replace("]]>", "");

      description = this.getTextBetween("<description>","</description>",itemArray[i]);
      description = description.replace("<description><![CDATA[", "");
      description = description.replace("]]>", "");
      //get image
      image = this.getTextBetween('media:content medium="image" url=','" height=',itemArray[i]);
      image = image.replace('media:content medium="image" url="', "");

      link = this.getTextBetween("<link>","</link>",itemArray[i]);
      link = link.replace("<link>", "");
      link = link.replace("]]>", "");

      category = this.getTextBetween("<category>","</category>",itemArray[i]);
      category = category.replace("<category>", "");

      this.cnnNewsArray.push({Title: title, Description: description, Image: image, Link: link, Category: 'news'});
    }
    console.log(this.cnnNewsArray);
  }

  private extractCNNEntertainmentUtils(itemArray){
    for(var i = 0; i < itemArray.length; i++){
      var title = "";
      var description = "";
      var image = "";
      var link = "";
      var category = "";

      title = this.getTextBetween("<title>","</title>",itemArray[i]);
      title = title.replace("<title><![CDATA[", "");
      title = title.replace("]]>", "");

      description = this.getTextBetween("<description>","</description>",itemArray[i]);
      description = description.replace("<description>", "");
      description = description.substring(0, description.indexOf('&lt;img'));

      //get image
      image = this.getTextBetween('<media:content','" height',itemArray[i]);
      image = image.replace('<media:content medium="image" url="', "");

      link = this.getTextBetween("<link>","</link>",itemArray[i]);
      link = link.replace("<link>", "");
      link = link.replace("]]>", "");

      category = this.getTextBetween("<category>","</category>",itemArray[i]);
      category = category.replace("<category>", "");

      this.cnnEntertainmentArray.push({Title: title, Description: description, Image: image, Link: link, Category: 'entertainment'});
    }
    console.log(this.cnnEntertainmentArray);
  }

  private extractBBCTechUtils(itemArray){
    for(var i = 0; i < itemArray.length; i++){
      var title = "";
      var description = "";
      var image = "";
      var link = "";
      var category = "";

      title = this.getTextBetween("<title>","</title>",itemArray[i]);
      title = title.replace("<title><![CDATA[", "");
      title = title.replace("]]>", "");

      description = this.getTextBetween("<description>","</description>",itemArray[i]);
      description = description.replace("<description>", "");
      description = description.replace('<![CDATA[', "");
      description = description.replace(']]>', "");
      //description = description.substring(0, description.indexOf('&lt;img'));

      //get image
      image = this.getTextBetween('media:thumbnail','/>',itemArray[i]);
      image = image.split('url="').pop();
      image = image.replace('"', "");


      link = this.getTextBetween("<link>","</link>",itemArray[i]);
      link = link.replace("<link>", "");

      this.bbcTechArray.push({Title: title, Description: description, Image: image, Link: link, Category: 'tech'});
    }
    console.log(this.bbcTechArray);
  }

  private getTextBetween(text1, text2, data){
    var itemStart = 0;
    var itemEnd = 0;
    var startPoint = 0;
    var endPoint = 0;
    var itemText = "";

    itemStart = data.indexOf(text1, startPoint);
    itemEnd = data.indexOf(text2, itemStart);

    for(itemStart; itemStart < itemEnd; itemStart++){
      itemText += data.charAt(itemStart);
    }
    return itemText;
  }

  private getLastOfManyTags(startText, endText, itemArray){
    var mString = startText;
    var regString = "" + startText;
    var re = new RegExp(regString, 'g');
    var mStringCount = (itemArray.match(re) || []).length;
    var mImageStart = 0;
    var mImageEnd = 0;
    var image = "";
    for(var j = 0; j < mStringCount; j++){
      image = "";
      mImageStart = itemArray.indexOf(startText, mImageStart);
      mImageEnd = itemArray.indexOf(endText, mImageStart);
      for(mImageStart; mImageStart < mImageEnd; mImageStart++){
        image += itemArray.charAt(mImageStart);
      }
    }
    var formatedImage = image.replace('<media:thumbnail url="', "");
    formatedImage += ".jpg";
    return formatedImage;
  }

  setAttributeWhenSafari(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
        //alert("chrome") // Chrome

      } else {
        document.getElementById("safari_text1").setAttribute("class", "safari_text");
        document.getElementById("safari_text2").setAttribute("class", "safari_text");
      }
    }
  }


  repositionFBLogin(){
    document.getElementById('fb1login').appendChild(document.getElementById('fbloginbtn'));
  }



  ngOnInit() {
    this.repositionFBLogin();
    this.setAttributeWhenSafari();
    this.runAllRequests();
  }
}
bootstrap(AppComponent, [HTTP_PROVIDERS]);
