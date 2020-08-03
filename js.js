$(window).ready(function(){
    const grid = [[1, 0, 0, 4, 0, 6, 0, 0, 9],
                  [0, 0, 8, 0, 9, 0, 0, 5, 0],
                  [5, 0, 0, 8, 0, 1, 0, 0, 4],
                  [6, 0, 9, 0, 0, 0, 1, 0, 5],
                  [7, 0, 1, 5, 6, 9, 2, 0, 8],
                  [8, 0, 2, 0, 0, 0, 4, 0, 6],
                  [9, 0, 0, 6, 0, 3, 0, 0, 2],
                  [0, 7, 0, 0, 4, 0, 5, 0, 0],
                  [3, 0, 0, 1, 0, 5, 0, 0, 7]]

    const htmlCell = "<div class='cell'></div>"
    const htmlBox = "<div class='box'></div>"
    const DOMgrid = $(".grid")
    const resetGridButton = $('.resetGrid')
    const resetFilledButton = $('.resetFilled')
    const calculateSudokuButton = $('.calculateSudoku')
    const cells = new Array()

    let mainLoop;
    let filledNumbers = 1;

    let iterations = 0;

    function generateInput(id){
        const value = grid[Math.floor(id/9)][Math.floor(id % 9)] !== 0 ? grid[Math.floor(id/9)][Math.floor(id % 9)] : '';
        return `<div class='input-item' id='input-${id}'>${value}</div>`;
    }

    resetFilledButton.on('click', function(){
        for(let cell of cells){
            if(!cell.constNumber) cell.removeNumber();
        }
    })

    calculateSudokuButton.on('click', function(){
        while(checkEnd()){
            solve()
            if(filledNumbers === 0){
                console.log('nie udało się wpisać żadnej cyfry');
                break;
            }
            filledNumbers = 0;
        }
    })

    resetGridButton.on('click', function(){
        for(let i=0; i<81; i++){
            cells[i].number = 0;
            cells[i].isActive = true;

            $(`#input-${i}`).text('')
            $(`#${i}`).text('')
        }
    })

    for(let i=0; i<9; i++)
        DOMgrid.append(htmlBox)
    
    const DOMboxes = $(".box")
    DOMboxes.each(function(index) {
        $(this).addClass(`box-${index}`)

        for(let i=0; i<9; i++)
            $(this).append(htmlCell)
        
        $(this).find('.cell').each(function(cellIndex){
            const row = Math.floor(index / 3) * 3 + Math.floor(cellIndex / 3)
            const col = Math.floor(index % 3) * 3 + Math.floor(cellIndex % 3)

            const id = row * 9 + col

            $(this).addClass(`cell-${cellIndex}`).addClass(`row-${row}`).addClass(`col-${col}`).attr('id', id)
        })
    })

    function fillCellByBox(box, cell, number){
        const cellToFill = $(`.box-${box}`).find(`.cell-${cell}`);
        cellToFill.html(number.toString());
    }

    function fillCellByCoords(col, row, number){
        const boxCol = Math.floor(col / 3)
        const boxRow = Math.floor(row / 3)
        const box = boxRow * 3 + boxCol

        const cellCol = Math.floor(col % 3)
        const cellRow = Math.floor(row % 3)
        const cell = cellRow * 3 + cellCol

        fillCellByBox(box, cell, number)
    }

    function fillByGrid(grid){
        let rowNumber = 0;
        let colNumber = 0;
        grid.forEach(row => {
            row.forEach(number => {
                if(number != 0)
                    fillCellByCoords(colNumber, rowNumber, number)
                
                const active = number === 0 ? true : false;
                const constant = number === 0 ? false : true;
                cells.push(new Cell(rowNumber, colNumber, number, active, constant))
                colNumber++;
            })
            rowNumber++;
            colNumber = 0;
        });
    }

    $('.cell').on('click', function(){
        const id = $(this).attr('id')
        cells[id].highlight(true)
    })

    function moveCursor(key){
        let moveVectorValue;
        switch(key){
            case 'ArrowDown':
                moveVectorValue = 9;
                break;
            case 'ArrowUp':
                moveVectorValue = -9;
                break;
            case 'ArrowLeft':
                moveVectorValue = -1;
                break;
            case 'ArrowRight':
                moveVectorValue = 1;
                break;
        }

        const id = parseInt($('.clicked2').attr('id'))
        const newId = (id + moveVectorValue > 80 || id + moveVectorValue < 0) ? id : id + moveVectorValue
        cells[newId].highlight(true);
    }

    $(window).on('keydown', function({key}){
        // console.log(key);
        switch(key){
            case 'c':
            case 'C':
                cells[0].unHighlight();
                break;

            case 's':
            case 'S':
                solve()
                if(filledNumbers === 0)
                    console.log('nie udało się wpisać żadnej cyfry');
                filledNumbers = 0;
                break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                addNumber(key);
                break;

            case 'ArrowDown':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowRight':
                moveCursor(key);
                break;

            case 'Backspace':
                removeNumber();
                break;
        }   
        
    })

    function removeNumber(){
        const id = $('.clicked2').attr('id')
        cells[id].removeNumber();
    }

    function addNumber(key){
        const index = $('.clicked2').attr('id')
        cells[index].fillConstNumber(parseInt(key));
    }

    function checkEnd(){
        return !cells.every(cell => cell.number !== 0)
    }

    function numberCheck(i){
        const foundArray = new Array();
        for(let j=0; j<9; j++)
            foundArray[j+1] = (cells[i].checkPossibility(j + 1, cells))
        
        if(foundArray.filter(el => el).length === 1){
            const number = foundArray.indexOf(true)
            filledNumbers++;
            cells[i].fillNumber(number)
            // console.log(`NUMBER FILLING ::: filling box - ${cells[i].box}, cell - ${cells[i].cell} with number - ${number}`)
        }
    }

    function resetActive(){
        for(let cell of cells){
            if(cell.number === 0) cell.setActive()
        }
    }

    function fillBox(number){
        const boxes = new Array();

        for(let box=0; box<9; box++){
            const cellsInBox = new Array();
            for(let cell of cells)
                if(cell.box === box) cellsInBox.push({...cell})
            
            boxes.push(cellsInBox);
        }

        for(let box of boxes){
            const foundArray = new Array();
            for(let cell of box){
                if(cell.isActive) foundArray.push({...cell})
            }

            if(foundArray.length === 1){
                filledNumbers++;
                cells.find(cell => foundArray[0].row === cell.row && foundArray[0].col === cell.col).fillNumber(number)
                // console.log(`BOX FILLING ::: filling box - ${foundArray[0].box}, cell - ${foundArray[0].cell} with number - ${number}`)
            }
        }

    }

    function boxReverseCheck(i){
        const filteredCells = cells.filter(cell => cell.number === i + 1)
        for(let filteredCell of filteredCells){
            for(let cell of cells){
                if(cell.box === filteredCell.box || cell.row === filteredCell.row || cell.col === filteredCell.col){
                    cell.setUnActive();
                }
            }
        }

        fillBox(i + 1)
        resetActive();
    
    }

    function solve(){
        iterations++
        for(let i=0; i<80; i++){
            if(cells[i].number === 0){
                numberCheck(i);
            }
        }

        for(let i=0; i<9; i++)
            boxReverseCheck(i);
        
        if(! checkEnd()){
            console.log('iterations: '+ iterations)
            iterations = 0;
            clearInterval(mainLoop);
        }
    }
    
    fillByGrid(grid);
})

class Cell{
    constructor(row, col, number, active, constant){
        this.row = row,
        this.col = col,
        this.number = number

        this.boxCol = Math.floor(col / 3)
        this.boxRow = Math.floor(row / 3)
        this.cellCol = Math.floor(col % 3)
        this.cellRow = Math.floor(row % 3)

        this.box = this.boxRow * 3 + this.boxCol
        this.cell = this.cellRow * 3 + this.cellCol

        this.isActive = active;
        this.constNumber = constant
    };

    removeNumber(){
        this.isActive = true;
        this.number = 0;
        $(`.box-${this.box} .cell-${this.cell}`).text('').removeClass('red')
    }

    setUnActive(){
        this.isActive = false;
    };

    setActive(){
        this.isActive = true;
    }

    unHighlight(){
        $(".cell").removeClass('clicked')
        $(".box").removeClass('clicked')
        $(".cell").removeClass('clicked2')
    };

    highlight(flag){
        if(flag) this.unHighlight();

        $(`.cell.row-${this.row}`).addClass('clicked')
        $(`.cell.col-${this.col}`).addClass('clicked')
        $(`.box-${this.box}`).addClass('clicked')

        $(`.box-${this.box} .cell-${this.cell}`).addClass('clicked2')
    };

    checkPossibility(number, cells){
        for(let cell of cells){
            if((cell.row === this.row || cell.col === this.col || cell.box === this.box) && 
                cell.number === number)
                return false;
        }

        return true;
    };

    fillNumber(number){
        this.number = number
        $(`.box-${this.box} .cell-${this.cell}`).text(number).addClass('red')
    };

    fillConstNumber(number){
        this.number = number
        this.isActive = false;
        this.constNumber = true;
        $(`.box-${this.box} .cell-${this.cell}`).text(number)
    }
}