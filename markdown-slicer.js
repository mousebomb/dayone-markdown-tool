/** /Users/rhett/Documents/1-Life生活/生命历程/生命历程2013~2020/Export - All Entries (2020-02-15)/2011-10-9 - Entries.md 整理为按月份的日记md文件 */

const fs = require("fs");
const args = process.argv.slice(2);
if ( args.length<1)
{
  console.error("参数filePrefixString必填");
  process.exit();
}


class DayOneSlicer
{
  _srcTextFilePath;
  _srcTextString;
  _saveFolderPath;


  constructor(srcTextFilePath)
  {
    this._srcTextFilePath = srcTextFilePath;
    // this._srcTextFilePath的上级目录
    this._saveFolderPath = this._srcTextFilePath.substring(0,this._srcTextFilePath.lastIndexOf("/"));
  }

  run()
  {

    // 从 _srcTextFilePath 文件中读取文本 到_srcTextString
    this._srcTextString = fs.readFileSync(this._srcTextFilePath, "utf8");
    // 遍历 _srcTextString 中的每一行，如果是日记头，则分析日期，临时存入当月数据，当日期的月份变化时，将当月数据写入文件
    var month = "";
    var monthFilePath = "";
    let monthDiaryContent = "";
    var day ="";


    var lines = this._srcTextString.split("\n");
    for (var i=0; i<lines.length ; i++)
    {
      const DIARY_BEGIN = "\tDate:\t";
      let diaryBeginLen = DIARY_BEGIN.length;
      const PHOTO_BEGIN = "\tPhoto:\t";
      var extraPhoto = "";
      var line = lines[i];
      if ( line.indexOf(DIARY_BEGIN) == 0 )
      {
        //新日记开始
        var date = line.substring(diaryBeginLen);
        let dateArr = date.split(" at ");
        let parsedDate = new Date(dateArr[0] );
        // 2020-02
        let eachMonth = parsedDate.getFullYear()+ "-"+ DayOneSlicer.padString(parsedDate.getMonth()+1,2);
        // 02.01 周六
        let eachDay = DayOneSlicer.padString(parsedDate.getMonth()+1,2) + "."+DayOneSlicer.padString(parsedDate.getDate(),2) +" "+  DayOneSlicer.weekDay (parsedDate.getDay()) ;


        if ( month != eachMonth )
        {
          // 月份变化了
          // 把当前月份的日记写入文件
          if ( monthFilePath != "" )
          {
            //写入文件
            fs.writeFileSync(monthFilePath, monthDiaryContent, "utf8");
          }
          // 开始新月份
          month = eachMonth;
          monthFilePath = this._saveFolderPath + "/" + month + ".md";
          monthDiaryContent = "# "+month+"\n";
          day = "";
        }

        if (day != eachDay)
        {
          //写入每日开头
          monthDiaryContent += "# "+ eachDay+"\n";
          day = eachDay;
        }

        console.log ("新日记开始", date, eachMonth,eachDay);
      }
      // 判断是否带图片（dayone只支持一幅图每篇日记）
      if ( line.indexOf(PHOTO_BEGIN) == 0 )
      {
        //本行是图片meta
        extraPhoto = line.substring(PHOTO_BEGIN.length);
      }
      // 转录内容
      monthDiaryContent += line+"\n";
      if ( extraPhoto) {
        monthDiaryContent+="![](2013~2020.assets/"+extraPhoto+")\n";
        extraPhoto = "";
      }
    }
    // 最后完结 ，把未完成的文件结束
    if ( monthFilePath != "" )
    {
      //写入文件
      fs.writeFileSync(monthFilePath, monthDiaryContent, "utf8");
    }




  }

  static weekDay (day){
    const weekDay = ["周日","周一","周二","周三","周四","周五","周六"];
    return weekDay[day];
  }

  // pad string
  static padString(num, n)
  {
    let str = num.toString();
    var len = str.length;
    while (len < n)
    {
      str = "0" + str;
      len++;
    }
    return str;
  }



}

new DayOneSlicer(args[0]).run();
