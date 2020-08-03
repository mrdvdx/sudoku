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
    const cells = new Array()

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
                
                cells.push(new Cell(rowNumber, colNumber, number))
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

    $(window).on('keydown', function({key}){
        switch(key){
            case 'c':
            case 'C':
                cells[0].unHighlight();
                break;

            case 's':
            case 'S':
                solve();
                break;
        }   
        
    })

    function checkEnd(cells){
        return !cells.every(cell => cell.number !== 0)
    }

    function numberCheck(i){
        const foundArray = new Array();
        for(let j=0; j<9; j++)
            foundArray[j+1] = (cells[i].checkPossibility(j + 1, cells))
        
        if(foundArray.filter(el => el).length === 1){
            const number = foundArray.indexOf(true)
            cells[i].fillNumber(number)
        }
    }

    function boxReverseCheck(i){
        const numberCells = new Array();
        for(let j=0; j<cells.length; j++){
            const {row, col, box, cell, number} = cells[j]
            if(number === (i + 1)){
                numberCells.push({
                    row,
                    col,
                    box,
                    cell,
                    number
                });
            }
        }

        for(let j=0; j<1; j++){
            const filteredCells = cells.filter(cell => cell.number === i + 1)
            // for(let cell of filteredCells){
            //     if(cell.box === this.box || cell.row === row || cell.col === coll)
            //         cell.setUnActive()
            // }
            console.log(filteredCells)
        }

    }

    function solve(){
        let iterations = 0;
        while(iterations < 1){
            iterations++
            for(let i=0; i<80; i++){
                if(cells[i].number === 0)
                    console.log('')
                    //numberCheck(i);
            }

            for(let i=0; i<1; i++)
                boxReverseCheck(i);
            
        }

        console.log('iterations: '+ iterations)
    }
    
    fillByGrid(grid);
})

class Cell{
    constructor(row, col, number){
        this.row = row,
        this.col = col,
        this.number = number

        this.boxCol = Math.floor(col / 3)
        this.boxRow = Math.floor(row / 3)
        this.cellCol = Math.floor(col % 3)
        this.cellRow = Math.floor(row % 3)

        this.box = this.boxRow * 3 + this.boxCol
        this.cell = this.cellRow * 3 + this.cellCol

        this.isActive = true;
    };

    setUnActive(){
        this.isActive = false;
    };

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
        $(`.box-${this.box} .cell-${this.cell}`).text(number).css('color', 'red')
    };
}