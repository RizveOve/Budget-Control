var budgetController = (function (){
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }; 
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

        var totalCalc = function(type){
        sum= 0;

        data.allItems[type].forEach(function(current){
            sum = sum + current.value;
        });
        
        data.totals[type] = sum;
    };
    
    var data =   {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc:0,
            exp:0
        },
        budget: 0,
        percentage: 0
    };
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            
            if(data.allItems[type].length>0){
                ID= data.allItems[type][data.allItems[type].length-1].id +1;
            }else{
                ID= 0;
            }
            
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        calculateBudget: function(){
            totalCalc('inc');
            totalCalc('exp');
        
            data.budget= data.totals.inc- data.totals.exp;
            if(data.totals.inc>0){
                data.percentage= Math.round (data.totals.exp/ data.totals.inc* 100);
            }else{
                data.percentage= '__';
            }
            
        },
        getBuget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                tolatExp: data.totals.exp,
                percentage: data.percentage,
            }

        },

        testing: function(){
            console.log(data);
        }
    }
    
}) ();


var UIController = (function (){
    
    var DOMString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        totalInc:'.budget__income--value',
        totalExp:'.budget__expenses--value',
        budget: '.budget__value',
        parcentage: '.budget__expenses--percentage',
        date: '.budget__title--month'
    }
    
    return{
        getInput : function(){
            return{
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat (document.querySelector(DOMString.inputValue).value)
            };
        },
        
        getDOMString: function(){
            return DOMString;
        },
        
        budgetViewer: function(obj){
            document.querySelector(DOMString.budget).textContent= obj.budget;
            document.querySelector(DOMString.parcentage).textContent= obj.percentage +'%';
            document.querySelector(DOMString.totalInc).textContent= obj.totalInc;
            document.querySelector(DOMString.totalExp).textContent= obj.tolatExp;
            
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            
            if(type === 'inc'){
                element= DOMString.incomeContainer;
                
                html= '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element= DOMString.expenseContainer;
                
                html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            newHtml= html.replace('%id%',obj.id);
            newHtml= newHtml.replace('%description%',obj.description);
            newHtml= newHtml.replace('%value%',obj.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearField: function(){
            var field, fieldArr;
            
            field= document.querySelectorAll(DOMString.inputDescription +', '+ DOMString.inputValue);
            fieldArr= Array.prototype.slice.call(field);
            
            fieldArr.forEach(function(current, index, array){
                current.value= "";
                
            fieldArr[0].focus();
            });
        }
    }
}) ();



var controller = (function (bgtCtrl, UICtrl){
    
    var setUpEventListeners = function(){
         var DOM = UICtrl.getDOMString();

        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
        document.querySelector(DOM.date).textContent= 'Octobor 2020';
    
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13){
                ctrlAddItem();
            }   
        });
    };
    var updateBudget = function(){
        bgtCtrl.calculateBudget();
        
        var budget = bgtCtrl.getBuget();
        
        //console.log(budget);
        
        UICtrl.budgetViewer(budget);
    }
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value> 0){
            newItem= budgetController.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem,input.type);
            UICtrl.clearField();
        }
            updateBudget();
        
        
    }
    
    return{
        init: function(){
            console.log('Started');
            var clrBudget = {
                budget: 0,
                totalInc: 0,
                tolatExp: 0,
                percentage: '__'
            }
            UICtrl.budgetViewer(clrBudget);
            setUpEventListeners();
          
        }
    };
        
   

})(budgetController, UIController);


controller.init();






