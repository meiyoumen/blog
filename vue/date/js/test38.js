
var emptyReg=/^\s*$/;
/**
 * 获取指定月份有多少天
 * @param year
 * @param month
 * @returns {number}
 */
function getDayCounts(year,month) {
    var days=0;
    if (month==2){
        days= year % 4 == 0 ? 29 : 28;
    } else if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
        days= 31;
    } else{
        days= 30;
    }
    return days;
}
function toDouble(num) {
    num = Number(num);
    if (num<10){
        num = '0'+num;
    }
    return num;
}
//日期面板控件
var datePanleVue=Vue.component('date-panel',{
    template:'#datePanel_tmp',
    delimiters:['<%','%>'],
    data:function () {
        var date=this.date;
        var obj={
            showPickYear:false,
            showPickDate:true,
            showPickMonth:false,
            year:'',
            month:'',
            day:'',
            tmpYear:'',
            tmpMonth:'',
            tmpDay:'',
            yearListMin:''
        };
        if (!emptyReg.test(date)){
            date = new Date(date);
            obj.year=date.getFullYear();
            obj.month=date.getMonth()+1;
            obj.day = date.getDate();
        }
        return obj;
    },
    props:{
        date:{
            type:null
        }
    },
    created:function () {
        if(emptyReg.test(this.year)){
            this.tmpYear=new Date().getFullYear();
        }else{
            this.tmpYear=this.year;
        }
        if(emptyReg.test(this.month)){
            this.tmpMonth=new Date().getMonth()+1;
        }else{
            this.tmpMonth=this.month;
        }
        if(emptyReg.test(this.day)){
            this.tmpDay="";
        }else{
            this.tmpDay=this.day;
        }
    },
    watch:{
        year:function () {
            if(emptyReg.test(this.year)){
                this.tmpYear=new Date().getFullYear();
            }else{
                this.tmpYear=this.year;
            }
        },
        month:function () {
            if(emptyReg.test(this.month)){
                this.tmpMonth=new Date().getMonth()+1;
            }else{
                this.tmpMonth=this.month;
            }
        },
        day:function () {
            if(emptyReg.test(this.day)){
                this.tmpDay="";
            }else{
                this.tmpDay=this.day;
            }
        },
        date:function () {
            var date=this.date;
            if (!emptyReg.test(date)){
                date = new Date(date);
                this.year=date.getFullYear();
                this.month=date.getMonth()+1;
                this.day = date.getDate();
            }else{
                this.year=this.month=this.day="";
            }
        }
    },
    'filters':{
        monthFilter:function (month) {
            var arr=["一","二","三","四","五","六","七","八","九","十","十一","十二"];
            return arr[month-1]+'月';
        },
        placehFilter:function (str,ph) {
            if (emptyReg.test(str)){
                return ph;
            }else{
                return str;
            }
        }
    },
    computed:{
        dateListShow:function () {
            var year=this.tmpYear;
            var month=this.tmpMonth;
            return this.getDateListShow(year,month);
        },
        formatVal:function () {
            var year=this.year;
            var month=this.month;
            var day=this.day;
            var text='';
            if (!emptyReg.test(year) && !emptyReg.test(month) && !emptyReg.test(day)){
                text=toDouble(this.year)+'-'+toDouble(this.month)+'-'+toDouble(this.day);
            }
            return text;
        },
        yearList:function () {
            var arr=[];
            var min=this.yearListMin;
            for (var i=min;i<=min+31;i++){
                arr.push(i);
            }
            return arr;
        }
    },
    methods:{
        getDayCounts:function (year,month) {//计算每个月有多少天
            var days=0;
            if (month==2){
                days= year % 4 == 0 ? 29 : 28;
            } else if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
                days= 31;
            } else{
                days= 30;
            }
            return days;
        },
        getDateList:function (year,month) {//获取当月的日期列表
            var days=this.getDayCounts(year,month);
            var initWeekIndex=new Date(year, month-1,1).getDay();
            var obj=null;
            var arr=[];
            for (var i=0;i<days;i++){
                obj={
                    'year':year,
                    'month':month,
                    'day':i+1,
                    'weekIndex':initWeekIndex,
                    'isDisabled':false
                }
                initWeekIndex=(initWeekIndex+1)%7;
                arr.push(obj);
            }
            return arr;
        },
        getDateListShow:function (year,month) {
            year = Number(year);month=Number(month);
            var curDateList=this.getDateList(year, month);
            var preDateList=this.getDateList(month==1?year-1:year,month==1?12:month-1);
            var nextDateList=this.getDateList(month==12?year+1:year,month==12?1:month+1);
            var initWeekIndex=curDateList[0].weekIndex;
            var preArr=function(){
                if (initWeekIndex==0){
                    return [];
                }else{
                    return preDateList.slice(-initWeekIndex);
                }
            }();
            var nextArr=nextDateList.slice(0,42-curDateList.length-initWeekIndex);
            return preArr.concat(curDateList,nextArr);
        },
        pickDate:function (year,month,day) {
            this.year=year;
            this.month=month;
            this.day=day;
            this.$emit('pick-date',this.formatVal);
        },
        switchPanel:function (flag) {
            this.$emit('switch-panel',flag);
        },
        dateClass:function (item) {
            var isWeek=false;
            var isCur=false;
            var isOtherDay=false;
            var classtext='';
            var year=this.tmpYear;
            var month=this.tmpMonth;
            var day=this.tmpDay;

            if (item.weekIndex == 6 || item.weekIndex == 0) {
                isWeek=true;
            }
            if (this.year==item.year && this.month==item.month && this.day==item.day){
                isCur=true;
            }
            if (month != item.month) {
                isOtherDay=true;
            }
            if (isOtherDay){
                classtext='otherDay';
            }else{
                if (isWeek){
                    classtext='wDay';
                }
                if(isCur){
                    classtext="cur";
                }
            }
            return classtext;
        },
        clearDate:function () {
            this.pickDate("","","");
        },
        pickToday:function () {
            var dayObj=new Date();
            this.pickDate(dayObj.getFullYear(),dayObj.getMonth()+1,dayObj.getDate());
        },
        adjustYear:function (flag) {
            this.tmpYear=this.tmpYear+flag;
            if (this.tmpYear<=this.yearListMin-1){
                this.yearListMin=this.tmpYear-31;
            }
            if (this.tmpYear>=this.yearListMin+31+1){
                this.yearListMin=this.tmpYear;
            }
        },
        adjustMonth:function (flag) {
            var tmpMonth=this.tmpMonth=this.tmpMonth+flag;
            if (tmpMonth==13){
                this.tmpMonth=1;
                this.tmpYear++;
            }else if (tmpMonth==0){
                this.tmpMonth=12;
                this.tmpYear--;
            }
        },
        selectYear:function () {
            this.showPickDate=false;
            this.showPickMonth=false;
            this.showPickYear=true;
            this.yearListMin=this.tmpYear-13;
        },
        closeSelectYear:function () {
            this.showPickDate=true;
            this.showPickYear=false;
        },
        pickYear:function (num) {
            this.tmpYear=num;
            this.closeSelectYear();
        },
        selectMonth:function () {
            this.showPickDate=false;
            this.showPickYear=false;
            this.showPickMonth=true;
        },
        closeSelectMonth:function () {
            this.showPickDate=true;
            this.showPickMonth=false;
        },
        pickMonth:function (num) {
            this.tmpMonth=num;
            this.closeSelectMonth();
        },
        changeYearRange:function (flag) {
            this.yearListMin+=flag*32;
        }
    }
});
//日期控件
Vue.component('date-picker',{
    template:'#datePicker_tmp',
    delimiters:['<%','%>'],
    data:function () {
        return{
            showPanel:false,
            placeHolder:'请选择日期',
            dateStr:this.date_prop
        }
    },
    props:['date_prop'],
    created:function () {

    },
    watch:{

    },
    'filters':{
        placehFilter:function (str,ph) {
            if (emptyReg.test(str)){
                return ph;
            }else{
                return str;
            }
        }
    },
    computed:{
    },
    methods:{
        pickDateFn:function (dateStr) {
            this.dateStr=dateStr;
            this.showPanel=false;
            this.$emit('pick-date',dateStr);
        },
        switchPanelFn:function (flag) {
            this.showPanel=flag;
        }
    }
});
Vue.component('date-range-picker',{
    "template":'#dateRangePicker_tmp',
    delimiters:['<%','%>'],
    data:function () {
        return {
            "showPanel":false,
            "placeHolder":'请选择日期范围',
            "from_date":this.from_date_prop,
            "to_date":this.to_date_prop
        }
    },
    watch:{
        "from_date":function (val) {
            this.$emit('pick-from-date',val, this.isValid);
        },
        "to_date":function (val) {
            this.$emit('pick-to-date',val,this.isValid);
        }
    },
    props:["from_date_prop","to_date_prop",'position'],
    created:function(){
        this.curTime=new Date().getTime();//不需要双向数据绑定
    },
    computed:{
        dateStr:function () {
            var fromDate=this.from_date;
            var toDate=this.to_date;
            if (!this.isValid){
                return this.placeHolder;
            }else{
                return fromDate+' 至 '+toDate;
            }
        },
        isValid:function () {
            var flag=false;
            var fromDate=this.from_date;
            var toDate=this.to_date;
            if (!emptyReg.test(fromDate) && !emptyReg.test(toDate) && new Date(toDate)>=new Date(fromDate)){
                flag = true;
            }
            return flag;
        },
        tipInfor:function () {
            var add=0;
            if (!this.isValid){
                return '时间范围不合法';
            }else{
                add=Math.ceil((new Date(this.to_date)-new Date(this.from_date))/(24*60*60*1000))+1;
                return '一共选择了'+add+'天（包含起始点）';
            }
        }
    },
    filters:{
        showPh:function (val,ph) {
            if(emptyReg.test(val)){
                return ph;
            }else{
                return val;
            }
        }
    },
    methods:{
        "pickDateFrom":function (dateStr) {
            this.from_date=dateStr;
        },
        "pickDateTo":function (dateStr) {
            this.to_date=dateStr;
        },
        "pickRange":function (flag) {
            var curTime=this.curTime;
            var dateObj=new Date(curTime);
            var year=dateObj.getFullYear();
            var month=dateObj.getMonth();
            var num=24*60*60*1000;
            var switchTime=this.switchTime;
            var tmpDateObj=null;

            switch (flag){
                case 'today':{
                    this.from_date=this.to_date=switchTime(curTime);
                    break;
                }
                case 'yestoday':{
                    curTime=curTime-num*1;
                    this.from_date=this.to_date=switchTime(curTime);
                    break;
                }
                case 'pre7':{
                    this.to_date=switchTime(curTime);
                    curTime=curTime-num*6;
                    this.from_date=switchTime(curTime);
                    break;
                }
                case 'pre30':{
                    this.to_date=switchTime(curTime);
                    curTime=curTime-num*29;
                    this.from_date=switchTime(curTime);
                    break;
                }
                case 'month':
                case 'lastMonth':{
                    if (flag=="lastMonth"){
                        if (month==0){
                            year--;
                            month=11;
                        }else{
                            month--;
                        }
                    }
                    tmpDateObj=this.getMonthRange(year, month);
                    this.from_date=tmpDateObj.from_date;
                    this.to_date=tmpDateObj.to_date;
                    break;
                }
            }
        },
        "switchTime":function (dateObj) {
            if ($.type(dateObj)!="object"){
                dateObj=new Date(dateObj);
            }
            return dateObj.getFullYear()+'-'+toDouble(dateObj.getMonth()+1)+'-'+toDouble(dateObj.getDate());
        },
        "getMonthRange":function (year,month) {
            var obj={
                "from_date":null,
                "to_date":null
            };
            var fromDateObj=new Date(year,month,1);
            var toDateObj=new Date(year,month,getDayCounts(year, month+1));
            obj.from_date=this.switchTime(fromDateObj);
            obj.to_date=this.switchTime(toDateObj);
            return obj;
        },
        "submitBtn":function () {
            this.showPanel=false;
        },
        "clearDate":function () {
            this.from_date=this.to_date="";
            this.showPanel=false;
        },
        rangePanelStyle:function () {
            var position=$.type(this.position)=="undefined"?'left':this.position;
            return position+':0px';
        }
    }
});
$(function () {
    new Vue({
        el:'#app',
        data:{
            from_date:'2017-04-10',
            to_date:'2017-04-25',
            createDate:'2018-09-12'
        },
        methods:{
            "pickFromDate":function (date,flag) {
                this.from_date=date;
            },
            "pickToDate":function (date,flag) {
                this.to_date=date;
            },
            "pickDate":function (date) {
                this.createDate=date;
            }
        }
    });
});
