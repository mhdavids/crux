// dynamicBuilderUI.js

// --- 1. Global State for the Argument Being Built & UI State ---
// Check if these exist from the main script, otherwise initialize
if (typeof argumentWorkspace === 'undefined') {
    window.argumentWorkspace = {
        premises: {
            // Dynamically populated based on HTML data-premise-id attributes
        },
        conclusionAST_form: { type: 'proposition', letter: 'K' } 
    };
}

if (typeof selectedFormulaElementInfo === 'undefined') {
    window.selectedFormulaElementInfo = null; // Stores { domElement: HTMLElement, premiseId: string, path: string }
}

// --- Helper Functions for AST Manipulation ---
function getASTNodeAtPath(baseAST, pathString) {
    // console.log(`LOG: getASTNodeAtPath called with base:`, baseAST, `Path: '${pathString}'`);
    if (!pathString || pathString === "") { 
        return baseAST;
    }
    if (!baseAST) { 
        return null;
    }

    const keys = pathString.split('.');
    let current = baseAST;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!current || typeof current !== 'object') { 
            return null; 
        }

        if (key === 'operands' && Array.isArray(current.operands)) {
             if (i + 1 < keys.length && !isNaN(parseInt(keys[i+1], 10))) {
                const index = parseInt(keys[i+1], 10);
                if (index >= 0 && index < current.operands.length) {
                    current = current.operands[index];
                    i++; 
                } else {
                    return null;
                }
            } else { // Path might end at 'operands' or next key is not an index for it
                current = current.operands; 
                if (!Array.isArray(current) && i < keys.length -1) { // If not array but path continues
                    return null;
                }
            }
        } else if (Array.isArray(current) && !isNaN(parseInt(key, 10))) { // Current is an array (e.g. operands) and key is the index
            const index = parseInt(key, 10);
            if (index >= 0 && index < current.length) {
                current = current[index];
            } else {
                return null; 
            }
        } else if (current.hasOwnProperty(key)) { // Regular object property like 'operand'
            current = current[key];
        } else {
            return null; // Key not found
        }
    }
    return current;
}

function updateNestedAST(baseAST, pathString, newValue) {
    // console.log(`LOG: updateNestedAST called. Base:`, JSON.parse(JSON.stringify(baseAST)), `Path: '${pathString}'`, `NewValue:`, newValue ? JSON.parse(JSON.stringify(newValue)) : null);
    if (!baseAST || typeof pathString !== 'string' || pathString === "") {
        console.error("updateNestedAST: Invalid baseAST or empty/invalid pathString for nested update.", { baseAST, pathString });
        return false;
    }

    const keys = pathString.split('.');
    let current = baseAST;
    let i = 0;

    for (i = 0; i < keys.length - 1; i++) { // Traverse to the parent of the target
        let key = keys[i];
        let nextKey = keys[i+1];
        
        if (key === 'operands') {
            if (!current.operands) current.operands = [null, null]; 
            else if (!Array.isArray(current.operands)) {
                 console.error(`updateNestedAST: 'operands' is not an array at path segment '${key}'. Path: ${pathString}`); return false;
            }
            current = current.operands; 
             if (isNaN(parseInt(nextKey, 10))) { // Next part of path after 'operands' must be an index
                console.error(`updateNestedAST: Expected index after 'operands' but got '${nextKey}' in path: ${pathString}`);
                return false;
             }
             // The loop will continue, and the next 'key' (which is `nextKey` here) will be treated as an index
        } else if (Array.isArray(current) && !isNaN(parseInt(key, 10))) { 
            const index = parseInt(key, 10);
            if (index >= 0 && (index < current.length || current.length === 0 )) { 
                if (current[index] === null && i < keys.length - 1) { 
                   current[index] = {}; 
                   console.warn("updateNestedAST: Auto-vivified object in array at index", index, "Path:", pathString);
                }
                current = current[index];
            } else {
                console.error(`updateNestedAST: Index '${key}' out of bounds for array. Path: ${pathString}`, current);
                return false;
            }
        } else if (current && (current.hasOwnProperty(key) || (key === 'operand' && current.operator === 'NOT'))) { 
             if (current[key] === null && i < keys.length - 1) {
                current[key] = {}; 
                console.warn("updateNestedAST: Auto-vivified null property '"+key+"' as object. Path:", pathString);
             }
            current = current[key];
        } else {
            console.error(`updateNestedAST: Invalid key '${key}' in path segment. Path: ${pathString}`, current);
            return false;
        }
         if (current === null && i < keys.length - 1) { 
            console.error(`updateNestedAST: Path traversal resulted in null before target. Path: ${pathString}`);
            return false;
        }
    }

    const finalKey = keys[keys.length - 1];
    if (current && typeof current === 'object') {
        if (Array.isArray(current) && !isNaN(parseInt(finalKey, 10))) { // finalKey is an index for the current array (operands)
            const index = parseInt(finalKey, 10);
            while(index >= current.length) { // Ensure array is long enough
                current.push(null);
            }
            current[index] = newValue; 
            return true;
        } else { // finalKey is a property name for the current object (e.g., 'operand')
            current[finalKey] = newValue; 
            return true;
        }
    } else {
        console.error(`updateNestedAST: Target for assignment is not an object/array or is null. Path: ${pathString}`, current);
        return false;
    }
}

// --- UI Rendering Functions ---
window.renderTopLevelPremise = function(premiseId) {
    console.log("LOG: renderTopLevelPremise called for premiseId:", premiseId);
    const mainDropZoneElement = document.getElementById(`premise-${premiseId}-dropzone`); 
    
    // console.log("LOG: renderTopLevelPremise - getElementById result for `premise-${premiseId}-dropzone`:", mainDropZoneElement);

    if (mainDropZoneElement) {
        renderPremiseSlot(mainDropZoneElement, argumentWorkspace.premises[premiseId], premiseId);
    } else {
        console.error(`LOG: CRITICAL - Cannot find main drop zone 'premise-${premiseId}-dropzone' in renderTopLevelPremise.`);
    }
}

function renderPremiseSlot(targetRenderElement, astNode, premiseId) {
    // console.log(`LOG: renderPremiseSlot for premiseId: ${premiseId}, Target Element ID: ${targetRenderElement ? targetRenderElement.id : 'null_target_element'}, AST:`, astNode ? JSON.parse(JSON.stringify(astNode)) : null);
    if (!targetRenderElement) {
        console.error(`LOG: CRITICAL - renderPremiseSlot received null targetRenderElement for premiseId: ${premiseId}`);
        return;
    }
    targetRenderElement.innerHTML = ''; 
    targetRenderElement.classList.remove('empty-drop-zone', 'drag-over');
    clearCombinationPrompt(targetRenderElement); 

    if (!astNode) {
        targetRenderElement.textContent = "[Drop content here]";
        targetRenderElement.classList.add('empty-drop-zone');
    } else {
        targetRenderElement.appendChild(buildVisualFromAST(astNode, premiseId, "")); 
    }
    targetRenderElement.dataset.premiseId = premiseId;
    // Only set path if it's a main drop zone (sub-drop-zones get their path from buildVisualFromAST)
    if (!targetRenderElement.classList.contains('sub-drop-zone')) { 
        targetRenderElement.dataset.path = ""; 
    }
}

function buildVisualFromAST(currentASTNode, premiseId, currentPath) {
    const elementWrapper = document.createElement('span'); 
    elementWrapper.classList.add('formula-element-wrapper');
    elementWrapper.dataset.premiseId = premiseId; 
    elementWrapper.dataset.path = currentPath;    
    elementWrapper.style.margin = "0 1px";
    elementWrapper.style.verticalAlign = "middle";
    elementWrapper.style.cursor = 'pointer'; 
    elementWrapper.tabIndex = 0; // For focusability if needed for keyboard selection later

    elementWrapper.addEventListener('click', (event) => {
        event.stopPropagation(); 
        handleFormulaElementSelect(elementWrapper, premiseId, currentPath);
    });

    if (!currentASTNode) { 
        const subDropZone = document.createElement('div');
        subDropZone.className = 'drop-zone sub-drop-zone rendered-empty-slot'; 
        subDropZone.textContent = '[slot]';
        subDropZone.dataset.premiseId = premiseId;    
        subDropZone.dataset.path = currentPath; 
        subDropZone.style.cssText = "display: inline-block; vertical-align: middle; padding: 5px; border: 1px dashed #aaa; min-width: 50px; min-height: 24px; line-height: 24px; text-align: center; background-color: #fdfdfd; margin: 0 2px;";
        subDropZone.addEventListener('click', (event) => event.stopPropagation()); 
        elementWrapper.appendChild(subDropZone);
        return elementWrapper;
    }

    if (currentASTNode.type === 'proposition') {
        const propBubble = document.createElement('div');
        propBubble.className = `palette-item proposition rendered-proposition ${currentASTNode.colorClass || `prop-${currentASTNode.letter.toLowerCase()}`}`;
        
        // Check if we have a text definition for this letter
        const letter = currentASTNode.letter;
        const text = window.statementDefinitions && window.statementDefinitions[letter];
        
        if (text && text.trim() !== '') {
            propBubble.classList.add('with-text');
            propBubble.innerHTML = `<strong>${letter}:</strong> ${text}`;
            propBubble.title = `${letter}: ${text}`;
        } else {
            propBubble.textContent = letter;
        }
        
        propBubble.style.display = 'inline-block'; 
        propBubble.style.verticalAlign = "middle";
        propBubble.style.cursor = letter === 'K' ? 'default' : 'pointer';
        
        // Make proposition clickable for editing (except K)
        propBubble.addEventListener('click', (event) => {
            event.stopPropagation();
            if (letter !== 'K' && window.editPropositionText) {
                window.editPropositionText(letter);
            }
        });
        
        elementWrapper.appendChild(propBubble);
    } else if (currentASTNode.type === 'operator') {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'formula-group rendered-group'; 
        groupDiv.style.cssText = "display: inline-flex; align-items: center; border: 1px solid #d0d0d0; padding: 2px 3px; border-radius: 4px; background-color: #f0f0f0; margin: 2px; vertical-align: middle;";
        
        const opTextSpan = document.createElement('span');
        opTextSpan.className = 'formula-operator'; // General class for operator text
        opTextSpan.style.margin = "0 3px";
        // opTextSpan.style.cursor = 'pointer'; // Make operator text itself part of the clickable group via elementWrapper

        if (currentASTNode.operator === 'NOT') {
            opTextSpan.textContent = 'NOT';
            groupDiv.appendChild(opTextSpan);
            groupDiv.appendChild(buildVisualFromAST(currentASTNode.operand, premiseId, currentPath ? `${currentPath}.operand` : 'operand'));
        } else { // Binary operators
            if (currentASTNode.operator === 'IFTHEN') {
                const ifSpan = document.createElement('span');
                ifSpan.className = 'formula-operator'; // Make it look like an operator
                ifSpan.textContent = 'IF ';
                groupDiv.appendChild(ifSpan);
                groupDiv.appendChild(buildVisualFromAST(currentASTNode.operands[0], premiseId, currentPath ? `${currentPath}.operands.0` : 'operands.0'));
                
                const thenSpan = document.createElement('span');
                thenSpan.className = 'formula-operator';
                thenSpan.style.margin = "0 3px";
                thenSpan.textContent = ' THEN ';
                groupDiv.appendChild(thenSpan);
                
                groupDiv.appendChild(buildVisualFromAST(currentASTNode.operands[1], premiseId, currentPath ? `${currentPath}.operands.1` : 'operands.1'));
            } else { // AND, OR
                groupDiv.appendChild(document.createTextNode('('));
                groupDiv.appendChild(buildVisualFromAST(currentASTNode.operands[0], premiseId, currentPath ? `${currentPath}.operands.0` : 'operands.0'));
                
                opTextSpan.textContent = currentASTNode.operator; // e.g., " AND " or " OR "
                groupDiv.appendChild(opTextSpan);
                
                groupDiv.appendChild(buildVisualFromAST(currentASTNode.operands[1], premiseId, currentPath ? `${currentPath}.operands.1` : 'operands.1'));
                groupDiv.appendChild(document.createTextNode(')'));
            }
        }
        elementWrapper.appendChild(groupDiv);
    } else {
        console.error("LOG: buildVisualFromAST - Unknown AST node type:", currentASTNode);
        elementWrapper.textContent = "[Error AST]";
    }
    return elementWrapper;
}

function createVisualElementForAST(astNode) { 
    const bubble = document.createElement('span'); 
    if (!astNode) {
        bubble.textContent = "[slot]";
        bubble.style.cssText = "font-style: italic; color: #888; border: 1px dashed #ccc; padding: 2px 5px; display: inline-block;";
        return bubble;
    }
    if (astNode.type === 'proposition') {
        bubble.className = `palette-item proposition ${astNode.colorClass || `prop-${astNode.letter.toLowerCase()}`}`;
        
        // Check for text definition
        const letter = astNode.letter;
        const text = window.statementDefinitions && window.statementDefinitions[letter];
        
        if (text && text.trim() !== '') {
            bubble.classList.add('with-text');
            bubble.innerHTML = `<strong>${letter}:</strong> ${text}`;
        } else {
            bubble.textContent = letter;
        }
        
        bubble.style.cssText = 'display: inline-block; cursor: default; margin-right: 5px; vertical-align: middle;';
    } else if (astNode.type === 'operator') { 
        bubble.className = 'formula-group';
        let textPreview = "";
        if (astNode.operator === 'NOT') {
            textPreview = `(NOT ${astNode.operand ? (astNode.operand.letter || 'expr') : '_'})`;
        } else if (astNode.operator === 'IFTHEN') {
            textPreview = `(IF ${astNode.operands && astNode.operands[0] ? (astNode.operands[0].letter || 'expr') : '_'} THEN ${astNode.operands && astNode.operands[1] ? (astNode.operands[1].letter || 'expr') : '_'})`;
        } else { 
             textPreview = `(${astNode.operands && astNode.operands[0] ? (astNode.operands[0].letter || 'expr') : '_'} ${astNode.operator} ${astNode.operands && astNode.operands[1] ? (astNode.operands[1].letter || 'expr') : '_'})`;
        }
        bubble.textContent = textPreview; 
        bubble.style.cssText = 'display: inline-block; margin-right: 5px; border: 1px solid #ddd; padding: 2px 4px; background-color: #f0f0f0; border-radius: 3px; vertical-align: middle;';
    } else {
        bubble.textContent = "[expr]";
    }
    return bubble;
}

function clearCombinationPrompt(dropZoneElement) {
    if (!dropZoneElement) return;
    const existingPrompt = dropZoneElement.querySelector('.combination-prompt');
    if (existingPrompt) {
        existingPrompt.remove();
    }
}

function initiateCombinationPrompt(dropZoneElementForPromptDisplay, premiseId, subPathOfSlot, ast1, ast2) {
    console.log(`LOG: initiateCombinationPrompt for Premise ID: ${premiseId}, Path: '${subPathOfSlot}', ast1:`, ast1 ? JSON.parse(JSON.stringify(ast1)) : null, "ast2:", ast2 ? JSON.parse(JSON.stringify(ast2)) : null);
    clearCombinationPrompt(dropZoneElementForPromptDisplay); 

    const promptContainer = document.createElement('div');
    promptContainer.className = 'combination-prompt';
    promptContainer.style.cssText = "margin-top: 10px; padding: 5px; border: 1px solid #007bff; background-color: #f0f4f8; border-radius: 4px; text-align: left;";

    const message = document.createElement('span');
    message.textContent = "Combine with: ";
    message.style.marginRight = '10px';
    promptContainer.appendChild(message);

    ['AND', 'OR'].forEach(op => {
        const button = document.createElement('button');
        button.textContent = op;
        button.type = "button";
        button.style.marginLeft = "5px";
        button.className = "palette-item operator"; 
        button.onclick = function() {
            console.log(`LOG: Combination chosen: ${op}. Premise: ${premiseId}, Path: '${subPathOfSlot}'`);
            const combinedAST = { type: 'operator', operator: op, operands: [ast1, ast2] };
            let success = false;
            if (subPathOfSlot) { 
                success = updateNestedAST(argumentWorkspace.premises[premiseId], subPathOfSlot, combinedAST);
                if (!success) console.error("LOG: Prompt - Failed to update nested AST for path:", subPathOfSlot);
            } else { 
                argumentWorkspace.premises[premiseId] = combinedAST;
                success = true;
            }
            if (success) {
                renderTopLevelPremise(premiseId);
            }
        };
        promptContainer.appendChild(button);
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.style.cssText = "margin-left: 10px; background-color: #6c757d; color: white;";
    cancelButton.onclick = function() {
        console.log("LOG: Combination cancelled. Reverting slot to its state before ast2 was added (i.e., to ast1).");
        let success = false;
        if (subPathOfSlot) {
             success = updateNestedAST(argumentWorkspace.premises[premiseId], subPathOfSlot, ast1); 
        } else {
             argumentWorkspace.premises[premiseId] = ast1; 
             success = true;
        }
        if(success){
            renderTopLevelPremise(premiseId);
        } else {
            console.error("LOG: Failed to revert AST on cancel in prompt.");
            renderTopLevelPremise(premiseId); // Attempt to re-render current state anyway
        }
    };
    promptContainer.appendChild(cancelButton);
    
    dropZoneElementForPromptDisplay.appendChild(promptContainer); 
}

function handleOperatorDrop(droppedOperatorData, currentContentOfSlot) {
    // console.log("LOG: handleOperatorDrop. Operator:", droppedOperatorData.operator, "Current content in slot:", currentContentOfSlot ? JSON.parse(JSON.stringify(currentContentOfSlot)) : null);
    let newASTForSlot;
    const operator = droppedOperatorData.operator;

    if (operator === 'NOT') {
        newASTForSlot = {
            type: 'operator',
            operator: 'NOT',
            operand: currentContentOfSlot || null 
        };
    } else { // Binary operators AND, OR, IFTHEN
        if (!currentContentOfSlot) { 
            newASTForSlot = {
                type: 'operator',
                operator: operator,
                operands: [null, null]
            };
        } else if (currentContentOfSlot.type === 'proposition') {
            newASTForSlot = {
                type: 'operator',
                operator: operator,
                operands: [currentContentOfSlot, null]
            };
        } else { 
            console.warn(`Operator '${operator}' dropped on existing complex expression. Replacing with new operator structure.`);
            newASTForSlot = {
                type: 'operator',
                operator: operator,
                operands: [null, null] 
            };
        }
    }
    // console.log("LOG: handleOperatorDrop - Constructed new AST for slot:", newASTForSlot ? JSON.parse(JSON.stringify(newASTForSlot)) : null);
    return newASTForSlot; 
}

function cleanupDraggingState() {
    const draggingItem = document.querySelector('.dragging');
    if (draggingItem) draggingItem.classList.remove('dragging');
}

// --- Main Event Handlers for Drag and Drop ---
function handleDragStart(event) {
    // console.log("--- !!! handleDragStart IS DEFINITELY FIRING !!! ---"); 
    // console.log("Dragged item event.target:", event.target); 
    // console.log("Dragged item type:", event.target.dataset.type);
    // console.log("Dragged item letter:", event.target.dataset.letter);
    // console.log("Dragged item operator:", event.target.dataset.operator);

    const type = event.target.dataset.type;
    const letter = event.target.dataset.letter;
    const operator = event.target.dataset.operator;
    const colorClass = Array.from(event.target.classList).find(c => c.startsWith('prop-')) || '';

    const dragData = { type };
    if (letter) dragData.letter = letter;
    if (operator) dragData.operator = operator;
    if (colorClass) dragData.colorClass = colorClass;

    try {
        event.dataTransfer.setData("application/json", JSON.stringify(dragData));
        event.dataTransfer.effectAllowed = "copy";
        event.target.classList.add('dragging');
    } catch (e) {
        console.error("LOG: handleDragStart - Error setting dataTransfer:", e);
    }
}

function handleDragOver(event) {
    const targetZone = event.target.closest('.drop-zone, .sub-drop-zone');
    if (targetZone) {
        event.preventDefault(); 
        event.dataTransfer.dropEffect = "copy";
        if (!targetZone.classList.contains('drag-over')) {
             targetZone.classList.add('drag-over');
        }
    }
}

function handleDragLeave(event) {
    const targetZone = event.target.closest('.drop-zone, .sub-drop-zone');
    if (targetZone) {
        targetZone.classList.remove('drag-over');
    }
}

function handleDrop(event) {
    console.log("LOG: --- Main handleDrop function EXECUTING ---"); 
    event.preventDefault();
    
    const dropTargetElement = event.target.closest('.sub-drop-zone, .formula-element-wrapper, .drop-zone:not(.sub-drop-zone)'); 
    
    if (!dropTargetElement) {
        console.warn("LOG: Drop occurred, but not on a recognized actionable zone. Event target:", event.target);
        cleanupDraggingState();
        return;
    }
    
    const effectiveDropZoneForSlot = dropTargetElement.classList.contains('drop-zone') ? dropTargetElement : dropTargetElement.closest('.drop-zone, .sub-drop-zone');
    if (!effectiveDropZoneForSlot) {
         console.warn("LOG: Could not determine effective drop zone for slot context from target:", dropTargetElement);
         cleanupDraggingState(); return;
    }
    effectiveDropZoneForSlot.classList.remove('drag-over');

    const droppedItemDataString = event.dataTransfer.getData("application/json");
    if (!droppedItemDataString) { console.error("LOG: No data transferred on drop."); cleanupDraggingState(); return; }
    const droppedItemData = JSON.parse(droppedItemDataString);
    
    const premiseId = effectiveDropZoneForSlot.dataset.premiseId; 
    let targetPath = effectiveDropZoneForSlot.dataset.path || "";  

    // If NOT operator is dropped directly on a rendered proposition or group wrapper,
    // targetPath should be the path of that element being negated.
    if (droppedItemData.type === 'operator' && droppedItemData.operator === 'NOT' && 
        (dropTargetElement.classList.contains('formula-element-wrapper') || dropTargetElement.classList.contains('rendered-proposition'))) {
        targetPath = dropTargetElement.dataset.path || ""; 
        console.log("LOG: NOT operator targeting specific element. Path overridden to:", targetPath);
    }
    
    console.log(`LOG: Drop Event Data:`, droppedItemData, `Target Premise ID: '${premiseId}', Effective Slot/Element Path: '${targetPath}'`);
    
    if (!premiseId) {
        console.error("LOG: CRITICAL - premiseId could not be determined. Cannot proceed.", effectiveDropZoneForSlot);
        cleanupDraggingState();
        return;
    }

    let topLevelPremiseAST = argumentWorkspace.premises[premiseId];
    let newASTToPlace; // The AST that will replace/be placed at targetPath

    if (droppedItemData.type === 'proposition') {
        newASTToPlace = { type: 'proposition', letter: droppedItemData.letter, colorClass: droppedItemData.colorClass };
        const currentContentOfSlot = getASTNodeAtPath(topLevelPremiseAST, targetPath); 
        
        if (!currentContentOfSlot) { 
            console.log("LOG: handleDrop - Proposition to empty slot. Path:", targetPath);
        } else if (currentContentOfSlot.type === 'proposition') { 
            console.log("LOG: handleDrop - Proposition onto proposition in a slot, initiating combine prompt. Path:", targetPath);
            effectiveDropZoneForSlot.innerHTML = ''; 
            effectiveDropZoneForSlot.appendChild(createVisualElementForAST(currentContentOfSlot));
            effectiveDropZoneForSlot.appendChild(document.createTextNode(' + ')); 
            effectiveDropZoneForSlot.appendChild(createVisualElementForAST(newASTToPlace));
            // effectiveDropZoneForSlot.dataset.originalContentIfEmpty = 'false'; 
            initiateCombinationPrompt(effectiveDropZoneForSlot, premiseId, targetPath, currentContentOfSlot, newASTToPlace);
            cleanupDraggingState();
            return; 
        } else if (currentContentOfSlot.type === 'operator') {
            console.log("LOG: handleDrop - Proposition dropped onto existing operator group in slot. Prompting to combine.");
            effectiveDropZoneForSlot.innerHTML = ''; 
            effectiveDropZoneForSlot.appendChild(createVisualElementForAST(currentContentOfSlot)); 
            effectiveDropZoneForSlot.appendChild(document.createTextNode(' + ')); 
            effectiveDropZoneForSlot.appendChild(createVisualElementForAST(newASTToPlace));   
            // effectiveDropZoneForSlot.dataset.originalContentIfEmpty = 'false';
            initiateCombinationPrompt(effectiveDropZoneForSlot, premiseId, targetPath, currentContentOfSlot, newASTToPlace);
            cleanupDraggingState();
            return;
        }
         else { 
            alert("Propositions can generally only be dropped into empty slots or onto other propositions/groups for combining.");
            renderTopLevelPremise(premiseId); 
            cleanupDraggingState();
            return;
        }
    } else if (droppedItemData.type === 'operator') {
        const operatorToDrop = droppedItemData.operator;
        let existingContentAtTargetPath = getASTNodeAtPath(topLevelPremiseAST, targetPath); 

        if (operatorToDrop === 'NOT') {
            console.log("LOG: handleDrop - NOT operator dropped.");
            if (dropTargetElement.classList.contains('formula-element-wrapper') || dropTargetElement.classList.contains('rendered-proposition')) {
                // NOT dropped directly onto a rendered element (prop or group wrapper)
                const astOfClickedElement = getASTNodeAtPath(topLevelPremiseAST, targetPath); // targetPath IS the path of element
                console.log(`LOG: NOT dropped on existing element at path '${targetPath}', AST:`, astOfClickedElement ? JSON.parse(JSON.stringify(astOfClickedElement)) : null);
                if (!astOfClickedElement) { console.error("LOG: NOT dropped on element, but no AST found at its path."); cleanupDraggingState(); return; }
                newASTToPlace = { type: 'operator', operator: 'NOT', operand: astOfClickedElement };
                // targetPath is already correct (path of the element being replaced/wrapped)
            } else if (effectiveDropZoneForSlot.classList.contains('drop-zone') && !existingContentAtTargetPath) { 
                console.log("LOG: NOT dropped into an empty slot. Path:", targetPath);
                newASTToPlace = { type: 'operator', operator: 'NOT', operand: null };
            } else if (existingContentAtTargetPath) { 
                 console.warn("LOG: NOT dropped on a zone that has general content. Wrapping entire content of slot at path:", targetPath);
                 newASTToPlace = { type: 'operator', operator: 'NOT', operand: existingContentAtTargetPath };
            } else {
                 console.warn("LOG: NOT operator dropped on an unhandled target."); newASTToPlace = null;
            }
        } else { // Binary operators
            newASTToPlace = handleOperatorDrop(droppedItemData, existingContentAtTargetPath);
        }

        if (!newASTToPlace) { 
             console.warn("LOG: Operator drop resulted in no new AST. No change.");
             renderTopLevelPremise(premiseId);
             cleanupDraggingState();
             return;
        }
    } else { /* ... unknown type ... */ cleanupDraggingState(); return; }

    // Update the workspace state
    if (targetPath) { 
        if(!topLevelPremiseAST && newASTToPlace) { 
             argumentWorkspace.premises[premiseId] = newASTToPlace;
        } else if (topLevelPremiseAST && updateNestedAST(topLevelPremiseAST, targetPath, newASTToPlace)) {
            // AST updated by reference
        } else if (topLevelPremiseAST) { 
            console.error("LOG: Failed to update nested AST at path:", targetPath, "for premiseId:", premiseId);
            cleanupDraggingState(); return;
        } else { 
            console.error("LOG: CRITICAL - targetPath present but topLevelPremiseAST is null & new AST not suitable as root. Cannot update.");
            cleanupDraggingState(); return;
        }
    } else { // Top-level drop on main premise slot (targetPath was effectively empty)
        argumentWorkspace.premises[premiseId] = newASTToPlace;
    }
    
    renderTopLevelPremise(premiseId);
    cleanupDraggingState();
}

// --- Selection and Deletion Functions ---
function handleFormulaElementSelect(clickedElementWrapper, premiseId, path) {
    // console.log(`LOG: handleFormulaElementSelect - Clicked Path: '${path}', Premise ID: '${premiseId}'`, clickedElementWrapper);
    if (selectedFormulaElementInfo && selectedFormulaElementInfo.domElement) {
        selectedFormulaElementInfo.domElement.classList.remove('selected-formula-element');
    }
    if (selectedFormulaElementInfo && selectedFormulaElementInfo.domElement === clickedElementWrapper) {
        selectedFormulaElementInfo = null; 
    } else {
        selectedFormulaElementInfo = { domElement: clickedElementWrapper, premiseId: premiseId, path: path };
        clickedElementWrapper.classList.add('selected-formula-element');
    }
}

function handleDeleteSelected() {
    if (!selectedFormulaElementInfo) { return; }
    const { premiseId, path, domElement } = selectedFormulaElementInfo;
    console.log(`LOG: handleDeleteSelected - Deleting: Premise ID '${premiseId}', Path: '${path}'`);
    if (!premiseId) { if(domElement) domElement.classList.remove('selected-formula-element'); selectedFormulaElementInfo = null; return; }
    
    if (path === "" || path === null || path === undefined) { 
        argumentWorkspace.premises[premiseId] = null;
    } else { 
        if (!updateNestedAST(argumentWorkspace.premises[premiseId], path, null)) { 
            console.error("LOG: Failed to delete (update to null) nested AST node at path:", path);
            if(domElement) domElement.classList.remove('selected-formula-element');
            selectedFormulaElementInfo = null; return; 
        }
    }
    if(domElement) domElement.classList.remove('selected-formula-element');
    selectedFormulaElementInfo = null;
    renderTopLevelPremise(premiseId);
}

// --- DOMContentLoaded to Initialize and Attach Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("LOG: DOMContentLoaded - dynamicBuilderUI.js script started. Initializing event listeners and initial state.");

    const allPremiseDropZones = document.querySelectorAll('#premisesContainer .drop-zone:not(.sub-drop-zone)');
    allPremiseDropZones.forEach(dz => {
        const premiseId = dz.dataset.premiseId;
        if (premiseId) { 
            if (!argumentWorkspace.premises.hasOwnProperty(premiseId) || argumentWorkspace.premises[premiseId] === undefined ) {
                 argumentWorkspace.premises[premiseId] = null; 
                 renderPremiseSlot(dz, null, premiseId); 
            } else {
                 renderPremiseSlot(dz, argumentWorkspace.premises[premiseId], premiseId);
            }
        } else {
            console.warn("LOG: Found a main drop zone without a premiseId during init:", dz);
        }
    });

    const paletteItems = document.querySelectorAll('#dynamicArgumentBuilder .palette-item');
    paletteItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart); 
        item.addEventListener('dragend', (event) => {
            event.target.classList.remove('dragging');
        });
    });
    if (paletteItems.length === 0) {
        console.error("LOG: CRITICAL - No .palette-item elements found! Dragging will not work.");
    }

    const premisesContainerEl = document.getElementById('premisesContainer'); 
    if (premisesContainerEl) {
        premisesContainerEl.addEventListener('dragover', handleDragOver); 
        premisesContainerEl.addEventListener('dragleave', handleDragLeave); 
        premisesContainerEl.addEventListener('drop', handleDrop); 
    } else {
        console.error("LOG: CRITICAL - #premisesContainer element not found! Dropping will not work.");
    }
    
    const addPremiseButton = document.getElementById('addPremiseButton');
    if (addPremiseButton) {
        addPremiseButton.addEventListener('click', () => {
            const currentPremisesContainer = document.getElementById('premisesContainer');
            const existingMainPremiseDropZones = currentPremisesContainer.querySelectorAll('.drop-zone:not(.sub-drop-zone)');
            const newPremiseNum = existingMainPremiseDropZones.length + 1;
            if (newPremiseNum > 5) { alert("Maximum of 5 premises allowed."); return; }

            const newPremiseOuterDiv = document.createElement('div');
            newPremiseOuterDiv.className = 'premise-slot';
            newPremiseOuterDiv.id = `premise-${newPremiseNum}-slot-container`; 
            const newPremiseLabel = document.createElement('span');
            newPremiseLabel.className = 'premise-label';
            newPremiseLabel.textContent = `Premise ${newPremiseNum}:`;
            newPremiseOuterDiv.appendChild(newPremiseLabel);
            const newDropZone = document.createElement('div');
            newDropZone.className = 'drop-zone empty-drop-zone'; 
            newDropZone.id = `premise-${newPremiseNum}-dropzone`; 
            newDropZone.dataset.premiseId = newPremiseNum.toString();
            newDropZone.textContent = "[Drop content here]";
            newPremiseOuterDiv.appendChild(newDropZone);

// Add URL input container for the new premise
const urlContainer = document.createElement('div');
urlContainer.className = 'premise-url-container';
urlContainer.style.marginTop = '10px';
urlContainer.innerHTML = `
    <label style="font-size: 14px; font-weight: normal;">Evidence URL (optional):</label>
    <input type="url" class="premise-url-input" id="premise-${newPremiseNum}-url" placeholder="https://example.com/evidence" style="width: 100%; margin-top: 5px;">
    <small style="color: #666; font-size: 12px;">Enter full URL or just domain (e.g., example.com)</small>
`;
newPremiseOuterDiv.appendChild(urlContainer);

currentPremisesContainer.appendChild(newPremiseOuterDiv);
            argumentWorkspace.premises[newPremiseNum.toString()] = null;
            renderPremiseSlot(newDropZone, null, newPremiseNum.toString()); 
        });
    } else { console.error("LOG: #addPremiseButton not found!"); }

    document.addEventListener('keydown', function(event) {
        if ((event.key === 'Delete' || event.key === 'Backspace') && selectedFormulaElementInfo) {
            event.preventDefault(); handleDeleteSelected();
        }
    });
    document.addEventListener('click', function(event) {
        if (selectedFormulaElementInfo && selectedFormulaElementInfo.domElement) {
            const clickedElement = event.target;
            if (!clickedElement.closest('.formula-element-wrapper, .combination-prompt button, .palette-item')) {
                selectedFormulaElementInfo.domElement.classList.remove('selected-formula-element');
                selectedFormulaElementInfo = null;
            }
        }
    }, true); 
}); // End of DOMContentLoaded