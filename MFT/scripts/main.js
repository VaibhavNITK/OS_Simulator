var blocks = [];
var filled = [];
var totalsize;
var numblocks;

var submitBtn = document.querySelector('#submitBtn');
submitBtn.onclick = getInitValues;

function getInitValues() {
    totalsize = document.querySelector('#totalMemSize').value;
    numblocks = document.querySelector('#numBlocks').value;

    if (totalsize && numblocks && numblocks > 0) {
        renderBlockInputs();
    } else {
        render('Please enter valid total memory size and number of blocks.', document.querySelector('#requestMsg'));
    }
}

function renderBlockInputs() {
    var template = "<label class='col-form-label'>Enter Block Sizes</label>";

    for (var i = 0; i < numblocks; i++) {
        template += "<input class='form-control blockInput' type='text' id='blockSize" + i + "'>";
    }

    template += "<button id='submitBlockBtn' class='btn btn-primary' style='margin-top: 36px'>Submit</button>";

    render(template, document.querySelector('#blockContainer'));

    var submitBlockBtn = document.querySelector('#submitBlockBtn');
    submitBlockBtn.onclick = getBlockSizes;
}

function getBlockSizes() {
    var flag = 0;

    for (var i = 0; i < numblocks; i++) {
        var blockSizeInput = document.querySelector('#blockSize' + i);
        var blockSize = parseInt(blockSizeInput.value);

        if (isNaN(blockSize) || blockSize <= 0) {
            render("Block size must be a positive number", document.querySelector('#requestMsg'));
            flag++;
        } else {
            blocks[i] = blockSize;
            filled[i] = 0;
        }
    }

    if (flag === 0) {
        var blockSum = blocks.reduce(function (a, b) {
            return a + b;
        }, 0);

        if (blockSum > totalsize) {
            render('Entered block sizes exceed the total size! Re-enter the block sizes.', document.querySelector('#requestMsg'));
        } else {
            render('Block sizes set successfully', document.querySelector('#requestMsg'));
            setupRequestAndRemoveHandlers();
        }
    }
}

function setupRequestAndRemoveHandlers() {
    var requestBtn = document.querySelector('#submitRequestBtn');
    requestBtn.onclick = handleRequest;

    var removeBtn = document.querySelector('#removeBtn');
    removeBtn.onclick = handleRemove;
}

function handleRequest() {
    var alloc = -1;
    var requestSize = parseInt(document.querySelector('#requestSize').value);

    if (isNaN(requestSize) || requestSize <= 0) {
        render("Request size must be a positive number", document.querySelector('#requestMsg'));
    } else {
        for (var i = 0; i < numblocks; i++) {
            if (blocks[i] >= requestSize && filled[i] === 0) {
                filled[i] = 1;
                render('Allocated block ' + i + ' to the request', document.querySelector('#requestMsg'));
                alloc = i;
                break;
            }
        }

        if (alloc === -1) {
            render("Request couldn't be accommodated.", document.querySelector('#requestMsg'));
        }
    }
}

function handleRemove() {
    var remove = parseInt(document.querySelector('#removeNum').value);

    if (isNaN(remove) || remove < 0 || remove >= numblocks) {
        render("Cannot remove a block that does not exist", document.querySelector('#requestMsg'));
    } else {
        filled[remove] = 0;
        render('Emptied block ' + remove, document.querySelector('#requestMsg'));
    }
}

function render(template, node) {
    if (!node) return;
    node.innerHTML = template;
}
