<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>The Crux</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* --- All Combined CSS (Your existing + Dynamic Builder styles) --- */
        body {
            font-family: 'Roboto', sans-serif; background-color: #f0f4f8;
            margin: 0; padding: 0;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2 { text-align: center; color: #333; }
        h1 { margin-top: 30px; font-size: 36px; }
        
        form#claimSetupForm { /* Form for initial K selection */
            background-color: #fff; padding: 25px; border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); margin-top: 30px;
        }
        form#claimSetupForm h2 { margin-top: 0; font-size: 24px; text-align: left; border-bottom: 1px solid #eee; padding-bottom:10px; margin-bottom:20px; }
        
        form#argumentForm { /* Old template form, if any parts are still used */
            background-color: #fff; padding: 25px; border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); margin-top: 30px;
            display: none;
        }
        form#argumentForm h2 { margin-top: 0; font-size: 28px; text-align: center; }


        label { display: block; margin-top: 15px; font-weight: bold; color: #555; }
        select, input[type="text"], input[type="url"], input[type="email"], input[type="password"], textarea {
            width: 100%; box-sizing: border-box; padding: 12px; margin-top: 5px;
            border: 1px solid #ccc; border-radius: 4px; font-size: 16px;
        }
        fieldset { margin-top:15px; border: 1px solid #ccc; padding:10px; border-radius:4px;}
        legend {font-weight:bold;}

        #argumentFormsContainer, #placeholders, #submitTemplateArgumentButton { display: none; } 
        
        button { 
            padding: 10px 15px; color: #fff; font-size: 16px; font-weight: bold;
            border: none; border-radius: 6px; cursor: pointer; margin-top: 10px; width: auto;
            background-color: #007bff; 
        }
        button:hover { opacity: 0.9; }
        button[type="submit"] { 
             background-color: #28a745; width: 100%; padding: 15px; font-size: 18px; margin-top: 25px;
        }
        button[type="submit"]:hover { background-color: #218838; }

        #argumentsList { margin-top: 50px; }
        .argument {
            background-color: #fff; padding: 25px; margin-bottom: 30px;
            border-left: 5px solid #007bff; border-radius: 6px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
        .argument-header { display: flex; align-items: center; }
        .argument-icon { font-size: 45px; color: #007bff; margin-right: 20px; }
        .argument-title { font-size: 26px; color: #333; margin: 0; }
        .argument-content { margin-top: 20px; font-size: 18px; color: #555; line-height: 1.6; }
        .argument-content ol { list-style-position: inside; padding-left: 0; }
        .argument-content li {
            margin-bottom: 15px; padding: 10px; border-radius: 5px;
            display: flex; flex-wrap: wrap; align-items: center; 
            border-bottom: 1px solid #eee; 
        }
        .argument-content li:last-child { border-bottom: none; }
        .premise-text { flex: 1; vertical-align: middle; margin-right: 10px; }
        .premise-vote-container { display: flex; align-items: center; margin-left: auto; flex-shrink: 0; }
        .premise-disagreement-count { font-size: 12px; color: #dc3545; margin-left: 5px; font-style: italic;}
        .premise-url { display: block; margin-top: 5px; font-size: 14px; width: 100%; }
        
        .disagree-premise-button {
            padding: 6px 10px; font-size: 13px; background-color: #dc3545; color: #fff;
            border: none; border-radius: 6px; cursor: pointer; align-self: center;
            width: auto; margin-top: 0; margin-left: 0; 
        }
        .disagree-premise-button:hover { background-color: #c82333; }
        
        .endorse-conclusion-button {
            padding: 10px 20px; font-size: 16px; background-color: #17a2b8; color: #fff;
            border: none; border-radius: 6px; cursor: pointer; margin-top: 5px;
            font-weight: bold; width: auto;
        }
        .endorse-conclusion-button:hover { background-color: #138496; }
        
        .endorsement-stats { font-size: 16px; color: #555; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;}
        .ranking-options { margin-top: 30px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;}
        .ranking-options label { font-weight: bold; margin-right: 5px; }
        .ranking-options select { width: auto; padding: 8px 12px; }

        @media (max-width: 968px) { 
            .builder-container {
                flex-direction: column;
            }
            .palette {
                width: 100%;
                max-width: none;
            }
            .workspace {
                min-width: auto;
                width: 100%;
            }
        } 
        
        #authContainer {
            background-color: #fff; padding: 25px; border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); margin-top: 30px;
        }
        #authContainer h2 { text-align: center; }
        #authContainer input {
            width: 100%; box-sizing: border-box; padding: 12px; margin-top: 10px; margin-bottom: 20px;
            border: 1px solid #ccc; border-radius: 4px; font-size: 16px;
        }
        #authContainer button { 
            width: 100%; padding: 12px; background-color: #007bff; color: #fff;
            font-size: 18px; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px;
        }
        #authContainer button:hover { background-color: #0056b3; }
        #logoutButton { 
            display: block; margin: 20px auto; background-color: #dc3545;
            width: auto; padding: 10px 20px; font-size: 16px; 
        }
        #logoutButton:hover { background-color: #c82333; }

        #dynamicArgumentBuilder {
            background-color: #f9f9f9; 
            margin-top: 40px; 
            padding: 20px; 
            border: 1px solid #ccc; 
            border-radius: 8px;
            display: none; /* Initially hidden */
        }
        #dynamicArgumentBuilder h2, #dynamicArgumentBuilder h3, #dynamicArgumentBuilder h4 {
            text-align: left; 
        }
        .builder-container { 
            display: flex; 
            gap: 20px; 
            flex-wrap: nowrap; /* Keep items on same line */
            align-items: stretch; /* Stretch items to full height */
            min-height: 400px; /* Ensure minimum height */
        }
        .palette {
            border: 1px solid #ddd; 
            padding: 15px; 
            border-radius: 5px; 
            background-color: #fff;
            width: 280px; /* Fixed width instead of flex-basis */
            flex-shrink: 0; /* Prevent shrinking */
            flex-grow: 0; /* Prevent growing */
            align-self: flex-start; /* Align to top */
        }
        .palette h3, .palette h4 { margin-top: 0; margin-bottom: 10px; }
        .palette-section { margin-bottom: 15px; }
        .palette-item {
            padding: 8px 12px; margin: 5px 2px; border: 1px solid #ccc; border-radius: 20px; 
            cursor: grab; display: inline-block; font-weight: bold; text-align: center;
            min-width: 40px; font-size: 14px; 
        }
        .palette-item.with-text {
            font-size: 12px;
            font-weight: normal;
            padding: 6px 10px;
            max-width: 250px;
            white-space: normal;
            word-wrap: break-word;
            line-height: 1.3;
            text-align: left;
            display: inline-block;
            vertical-align: middle;
        }
        .palette-item.proposition { color: #fff; }
        .prop-a { background-color: #E74C3C; } .prop-b { background-color: #3498DB; }
        .prop-c { background-color: #2ECC71; } .prop-d { background-color: #F1C40F; }
        .prop-k { background-color: #9B59B6; }
        .prop-e { background-color: #E67E22; }
        .prop-f { background-color: #1ABC9C; }
        .prop-g { background-color: #34495E; }
        .prop-h { background-color: #7F8C8D; }
        .prop-i { background-color: #C0392B; }
        .prop-j { background-color: #16A085; }
        .palette-item.operator { background-color: #e0e0e0; color: #333; border-radius: 5px; }
        .workspace {
            border: 1px solid #ddd; 
            padding: 15px; 
            border-radius: 5px; 
            background-color: #fff;
            flex: 1; /* Take remaining space */
            min-width: 400px; /* Ensure minimum width */
            overflow-x: auto; /* Allow horizontal scroll if needed */
        }
        .workspace h3 { margin-top: 0; margin-bottom: 15px; }
        .premise-slot {
            background-color: #f0f4f8; border: 2px dashed #ccc; padding: 10px;
            margin-bottom: 10px; border-radius: 4px; min-height: 40px; 
        }
        .premise-label, .conclusion-label { font-weight: bold; display: block; margin-bottom: 5px; }
        .drop-zone { 
            min-height: 30px; padding: 5px; background-color: #fff; border: 1px solid #eee; 
            overflow-x: auto; /* Allow horizontal scrolling for wide formulas */
        }
        .drop-zone.empty-drop-zone { color: #aaa; text-align: center; }
        .drop-zone.drag-over { background-color: #e6f7ff; border-color: #90caf9; }
        .sub-drop-zone { 
             display: inline-block; vertical-align: middle; padding: 5px; border: 1px dashed #aaa; 
             min-width: 50px; min-height: 24px; line-height: 24px; text-align: center; 
             background-color: #fdfdfd; margin: 0 2px;
        }
        .sub-drop-zone:hover {
            background-color: #e6f7ff;
            border-color: #007bff;
        }
        .sub-drop-zone.drag-over {
            background-color: #cce5ff;
            border-color: #004085;
            border-width: 2px;
        }
        .conclusion-area {
            margin-top: 20px; padding: 10px; background-color: #e9f5ff;
            border: 1px solid #a0c0ff; border-radius: 4px;
        }
        .conclusion-placeholder { font-weight: bold; font-size: 1.1em; padding: 5px; display: inline-block; }
        .formula-group { 
            display: inline-flex; align-items: center; border: 1px solid #d0d0d0; 
            background-color: #f0f0f0; padding: 2px 3px; margin: 2px; border-radius: 4px; vertical-align: middle;
        }
        .formula-operator { font-style: italic; color: #333; margin: 0 3px; }
        .formula-element-wrapper { margin: 0 1px; vertical-align: middle; display: inline-block; cursor:pointer; }
        .formula-element-wrapper.selected-formula-element > div { 
           outline: 2px solid #007bff !important; 
           outline-offset: 2px; 
           box-shadow: 0 0 8px rgba(0, 110, 255, 0.5);
        }
        .formula-element-wrapper[draggable="true"] { cursor: move; }
        .formula-element-wrapper.dragging { opacity: 0.5; }
        
        #addPremiseButton, #checkFormValidityButton, button[onclick="displayArguments()"], #setClaimAndBuildButton { 
             width: auto; padding: 8px 15px; font-size: 15px; margin-right: 10px; margin-top: 10px;
        }
         #addPremiseButton { background-color: #007bff; color: white; }
         #addPremiseButton:hover { background-color: #0056b3; }
         #checkFormValidityButton { background-color: #5cb85c; color: white; }
         #checkFormValidityButton:hover { background-color: #4cae4c; }
         button[onclick="displayArguments()"] { background-color: #17a2b8; color: white;}
         button[onclick="displayArguments()"]:hover { background-color: #117a8b; }
         #setClaimAndBuildButton { background-color: #28a745; color: white; width:100%; margin-top:20px; padding: 12px;}
         #setClaimAndBuildButton:hover { background-color: #218838; }

        .combination-prompt { 
            margin-top: 10px; padding: 5px; border: 1px solid #007bff; 
            background-color: #f0f4f8; border-radius: 4px; text-align:left;
        }
        .combination-prompt span { margin-right: 10px; }
        .combination-prompt button { 
            width: auto; padding: 5px 10px; font-size: 12px;
            margin-left: 5px; margin-top: 0; 
        }
        #trashCanArea {
            margin-top: 20px; 
            padding: 10px; 
            border: 2px dashed #ccc; 
            text-align: center; 
            background-color: #f0f0f0;
            transition: all 0.3s ease;
        }
        #trashCanArea:hover {
            background-color: #ffeeee;
            border-color: #ff6666;
        }
        #defineStatementsNowButton { 
            background-color: #6c757d; 
            margin-left: 10px;
        }
        #defineStatementsNowButton:hover {
            background-color: #5a6268;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>The Crux</h1>

        <div id="authContainer">
            <div id="registerForm">
                <h2>Register</h2>
                <input type="email" id="registerEmail" placeholder="Email" required>
                <input type="password" id="registerPassword" placeholder="Password" required>
                <button type="button" onclick="register()">Register</button>
            </div>
            <div id="loginForm">
                <h2>Login</h2>
                <input type="email" id="loginEmail" placeholder="Email" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <button type="button" onclick="login()">Login</button>
            </div>
        </div>

        <button id="logoutButton" type="button" onclick="logout()" style="display:none;">Logout</button>

        <form id="claimSetupForm"> 
            <h2>1. Define Your Argument's Main Claim</h2>
            <label for="categorySelect">Category:</label>
            <select id="categorySelect" required> <option value="">-- Choose a Category --</option></select>
            
            <label for="subcategorySelect">Subcategory:</label>
            <select id="subcategorySelect" required> <option value="">-- Choose a Subcategory --</option> </select>
            
            <label for="claimSelect">Main Claim Statement (K):</label>
            <select id="claimSelect" required> <option value="">-- Choose a Claim --</option> </select>
            
            <label for="stanceSelect">Your Stance on this Claim:</label>
            <select id="stanceSelect" required> 
                <option value="">-- Choose Your Stance --</option> 
                <option value="For">I will argue FOR this claim (Conclusion: K)</option> 
                <option value="Against">I will argue AGAINST this claim (Conclusion: NOT K)</option> 
            </select>
            <button type="button" id="setClaimAndBuildButton">Set Claim & Build Argument Form</button>
        </form>
        
        <form id="argumentForm" style="display:none;">
             <h2>Submit Argument (Template System - Deprecated)</h2>
             <p>This submission method is being phased out. Please use the "Define Your Argument's Main Claim" section above.</p>
             <label for="argumentTitle">Argument Title (Old Template)</label>
            <input type="text" id="argumentTitleOld" placeholder="Enter argument title">
            <div id="argumentFormsContainer" style="display:none;"></div>
            <div id="placeholders" class="placeholders" style="display:none;"></div>
            <button type="submit" id="submitTemplateArgumentButton" style="display:none;">Submit Template Argument</button>
        </form>


        <div id="dynamicArgumentBuilder" style="display:none;">
            <h2>2. Build Your Argument Form</h2>
            <div style="margin-bottom: 15px; padding: 10px; background-color: #e9ecef; border-radius: 4px; border: 1px solid #ced4da;">
                <strong>Main Claim (K):</strong> <span id="displayMainClaimK" style="font-style: italic;">Not yet set</span><br>
                <strong>Your Stance:</strong> You are arguing <span id="displayStanceOnK" style="font-weight:bold;">N/A</span> this claim.
            </div>
            <div class="builder-container">
                <div class="palette">
                    <h3>Palette</h3>
                    <div class="palette-section">
                        <h4>Propositions:</h4>
                        <div class="palette-item proposition prop-a" draggable="true" data-type="proposition" data-letter="A">A</div>
                        <div class="palette-item proposition prop-b" draggable="true" data-type="proposition" data-letter="B">B</div>
                        <div class="palette-item proposition prop-c" draggable="true" data-type="proposition" data-letter="C">C</div>
                        <div class="palette-item proposition prop-d" draggable="true" data-type="proposition" data-letter="D">D</div>
                        <div class="palette-item proposition prop-e" draggable="true" data-type="proposition" data-letter="E">E</div>
                        <div class="palette-item proposition prop-f" draggable="true" data-type="proposition" data-letter="F">F</div>
                        <div class="palette-item proposition prop-g" draggable="true" data-type="proposition" data-letter="G">G</div>
                        <div class="palette-item proposition prop-h" draggable="true" data-type="proposition" data-letter="H">H</div>
                        <div class="palette-item proposition prop-i" draggable="true" data-type="proposition" data-letter="I">I</div>
                        <div class="palette-item proposition prop-j" draggable="true" data-type="proposition" data-letter="J">J</div>
                        <div class="palette-item proposition prop-k" draggable="true" data-type="proposition" data-letter="K" title="This is your Main Claim">K (Main Claim)</div>
                    </div>
                    <div class="palette-section">
                        <h4>Operators:</h4>
                        <div class="palette-item operator op-ifthen" draggable="true" data-type="operator" data-operator="IFTHEN">IF...THEN</div>
                        <div class="palette-item operator op-and" draggable="true" data-type="operator" data-operator="AND">AND</div>
                        <div class="palette-item operator op-or" draggable="true" data-type="operator" data-operator="OR">OR</div>
                        <div class="palette-item operator op-not" draggable="true" data-type="operator" data-operator="NOT">NOT</div>
                    </div>
                     <div id="trashCanArea" style="margin-top: 20px; padding: 10px; border: 2px dashed #ccc; text-align: center; background-color: #f0f0f0;">
                        <i class="fas fa-trash" style="font-size: 24px; color: #777;"></i>
                        <p style="font-size: 12px; color: #777; margin-top: 5px;">Drag here or click selected to delete</p>
                    </div>
                </div>
                <div class="workspace">
                    <h3>Construct Premises:</h3>
                     <label for="dynamicArgumentTitle">Argument Title for this Structure:</label>
                    <input type="text" id="dynamicArgumentTitle" placeholder="Enter title for this argument structure" style="margin-bottom:15px;">
                    <div id="premisesContainer">
                        <div class="premise-slot" id="premise-1-slot-container"> 
                            <span class="premise-label">Premise 1:</span>
                            <div class="drop-zone" id="premise-1-dropzone" data-premise-id="1">[Drop content here]</div>
                        </div>
                        <div class="premise-slot" id="premise-2-slot-container">
                            <span class="premise-label">Premise 2:</span>
                            <div class="drop-zone" id="premise-2-dropzone" data-premise-id="2">[Drop content here]</div>
                        </div>
                    </div>
                    <button id="addPremiseButton" type="button">+ Add Premise</button>
                    <button id="defineStatementsNowButton" type="button" style="background-color: #6c757d; margin-left: 10px;">Define Statements (A, B, C...)</button>
                    
                    <div class="conclusion-area">
                        <span class="conclusion-label">Target Conclusion Form:</span>
                        <div class="conclusion-placeholder" id="conclusionPlaceholder">( K )</div> 
                    </div>
                    <div style="margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; font-size: 14px; color: #666;">
                        <strong>Tip:</strong> To create nested formulas like "IF A THEN (B OR C)", first drop the IF...THEN operator, then drop B and C into the empty slots that appear.
                    </div>
                    <hr style="margin: 20px 0;">
                    <button id="checkFormValidityButton" type="button">Validate Form Structure</button>
                    <div id="validityResult" style="margin-top: 10px; font-weight: bold;"></div>
                    <button id="defineStatementsButton" type="button" style="display:none; background-color: #007bff; margin-top:15px;">Next: Define Statements (A, B, C...)</button>
                </div>
            </div>
            <div id="statementDefinitionArea" style="display:none; margin-top: 20px; padding:15px; border:1px solid #ccc; background-color:#fff;">
                <h3>3. Define Your Statements</h3>
                <div id="statementInputsContainer"></div>
                <button id="submitDynamicArgumentButton" type="button" style="background-color: #28a745; margin-top:15px;">Submit Final Argument</button>
            </div>
        </div>
        <hr style="margin: 40px 0;"> 

        <div class="argument-filters">
            <h2>View Submitted Arguments</h2>
            <label for="filterClaimSelect">Filter by Claim:</label>
            <select id="filterClaimSelect"> <option value="">-- All Claims --</option> </select>
            <label for="filterStanceSelect">Filter by Stance:</label>
            <select id="filterStanceSelect"> <option value="">-- All Stances --</option> <option value="For">For</option> <option value="Against">Against</option> </select>
            <button type="button" onclick="displayArguments()">Filter Arguments</button>
        </div>

        <div class="ranking-options">
            <label for="rankingSelect">Sort Arguments By:</label>
            <select id="rankingSelect"> <option value="mostRecent">Most Recent</option> <option value="mostEndorsed">Most Endorsed</option> <option value="highestPercentage">Highest Endorsement Percentage</option> </select>
        </div>
        <div id="argumentsList"></div>
    </div>

    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore-compat.js"></script>

    <script>
        console.log("Script 1: Starting initialization");
        
        // Initialize Firebase immediately
        const firebaseConfig = {
          apiKey: "AIzaSyBujX8q4fDGROi4PEMAEq13NrwNNlAHBzo", 
          authDomain: "crux-da4ec.firebaseapp.com", 
          projectId: "crux-da4ec", 
          storageBucket: "crux-da4ec.firebasestorage.app", 
          messagingSenderId: "230106844798", 
          appId: "1:230106844798:web:7b0230b27a9caa7d6a522f" 
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        
        console.log("Script 1: Firebase initialized");

        // Define all global variables
        let selectedClaimTextForK = ''; 
        let selectedStanceForK = '';   
        let selectedArgumentForm = null; 
        let selectedClaimText = '';    
        let selectedStanceText = '';

        // Define authentication functions globally
        function register() {
            var email = document.getElementById('registerEmail').value;
            var password = document.getElementById('registerPassword').value;

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert('Registration successful!');
                    document.getElementById('registerEmail').value = '';
                    document.getElementById('registerPassword').value = '';
                })
                .catch((error) => {
                    alert(error.message);
                });
        }

        function login() {
            var email = document.getElementById('loginEmail').value;
            var password = document.getElementById('loginPassword').value;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert('Login successful!');
                    document.getElementById('loginEmail').value = '';
                    document.getElementById('loginPassword').value = '';
                })
                .catch((error) => {
                    alert(error.message);
                });
        }

        function logout() {
            firebase.auth().signOut().then(() => {
                alert('Logged out successfully!');
            }).catch((error) => {
                alert(error.message);
            });
        }
        
        console.log("Script 1: Auth functions defined");
        
        // Helper function to create an editable proposition bubble
        window.createEditablePropositionBubble = function(letter, text) {
            const bubble = document.createElement('span');
            bubble.className = `palette-item proposition prop-${letter.toLowerCase()}`;
            bubble.style.display = 'inline-block';
            bubble.style.cursor = 'pointer';
            bubble.style.position = 'relative';
            bubble.title = 'Click to edit statement';
            
            // Add hover effect
            bubble.style.transition = 'transform 0.2s';
            bubble.onmouseover = function() {
                this.style.transform = 'scale(1.05)';
            };
            bubble.onmouseout = function() {
                this.style.transform = 'scale(1)';
            };
            
            if (text && text.trim() !== '') {
                // Show text with proper formatting
                bubble.classList.add('with-text');
                bubble.innerHTML = `<strong>${letter}:</strong> ${text}`;
                bubble.title = `${letter}: ${text}`; // Show full text on hover
            } else {
                bubble.textContent = letter;
            }
            
            bubble.onclick = function(e) {
                e.stopPropagation();
                if (window.editPropositionText && typeof window.editPropositionText === 'function') {
                    window.editPropositionText(letter);
                }
            };
            
            // Special styling for K to indicate it's not editable
            if (letter === 'K') {
                bubble.style.cursor = 'default';
                bubble.title = 'Main claim (cannot be edited)';
                bubble.onclick = function(e) {
                    e.stopPropagation();
                    // Do nothing for K
                };
            }
            
            return bubble;
        };
        
        // Make functions globally available for dynamicBuilderUI.js
        window.argumentWorkspace = window.argumentWorkspace || { premises: {}, conclusionAST_form: null };
        window.statementDefinitions = window.statementDefinitions || {};
        window.selectedFormulaElementInfo = null;
    </script>

    <script src="validationEngine.js"></script> 
    <script src="dynamicBuilderUI.js"></script>  

    <script>
        // Trash can functionality
        document.addEventListener('DOMContentLoaded', function() {
            console.log("Setting up trash can functionality");
            
            const trashCanArea = document.getElementById('trashCanArea');
            if (trashCanArea) {
                // Make trash can clickable to delete selected element
                trashCanArea.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent deselection
                    console.log("Trash can clicked");
                    
                    // Check if there's a selected element
                    const selectedElement = document.querySelector('.selected-formula-element');
                    if (selectedElement) {
                        console.log("Found selected element to delete via trash click");
                        
                        // Make sure selectedFormulaElementInfo is set correctly
                        if (!window.selectedFormulaElementInfo) {
                            // Reconstruct the selection info from the element
                            window.selectedFormulaElementInfo = {
                                domElement: selectedElement,
                                premiseId: selectedElement.dataset.premiseId || '',
                                path: selectedElement.dataset.path || ''
                            };
                        }
                        
                        console.log("Current selectedFormulaElementInfo:", window.selectedFormulaElementInfo);
                        
                        // Trigger delete using the same method that works for drag
                        const deleteEvent = new KeyboardEvent('keydown', {
                            key: 'Delete',
                            code: 'Delete',
                            keyCode: 46,
                            which: 46,
                            bubbles: true,
                            cancelable: true
                        });
                        document.dispatchEvent(deleteEvent);
                    } else {
                        console.log("No element selected to delete");
                    }
                });
                
                // Prevent default drag over to allow drop
                trashCanArea.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    this.style.backgroundColor = '#ffcccc';
                    this.style.borderColor = '#ff0000';
                });
                
                // Remove drag over effect
                trashCanArea.addEventListener('dragleave', function() {
                    this.style.backgroundColor = '#f0f0f0';
                    this.style.borderColor = '#ccc';
                });
                
                // Handle drop on trash - properly delete the dragged element
                trashCanArea.addEventListener('drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Element dropped on trash");
                    
                    // Reset trash can appearance
                    this.style.backgroundColor = '#f0f0f0';
                    this.style.borderColor = '#ccc';
                    
                    try {
                        // Get the data from the drag event
                        const dragData = e.dataTransfer.getData('application/json');
                        if (dragData) {
                            const data = JSON.parse(dragData);
                            console.log("Dropped data:", data);
                            
                            // Check if it's a formula element being dragged
                            if (data.type === 'formula-element' && data.premiseId) {
                                console.log(`Looking for element with premise-id="${data.premiseId}" and path="${data.path || ''}"`);
                                
                                // Find all matching elements
                                const matchingElements = document.querySelectorAll(
                                    `.formula-element-wrapper[data-premise-id="${data.premiseId}"]`
                                );
                                
                                console.log(`Found ${matchingElements.length} elements with matching premise ID`);
                                
                                // Find the exact element by path
                                let elementToDelete = null;
                                matchingElements.forEach(el => {
                                    if (el.dataset.path === (data.path || '')) {
                                        elementToDelete = el;
                                        console.log("Found exact match for deletion");
                                    }
                                });
                                
                                if (elementToDelete) {
                                    console.log("Found element to delete:", elementToDelete);
                                    
                                    // Directly manipulate the selection state like dynamicBuilderUI.js does
                                    // First, clear any existing selection
                                    const currentlySelected = document.querySelector('.selected-formula-element');
                                    if (currentlySelected && currentlySelected !== elementToDelete) {
                                        currentlySelected.classList.remove('selected-formula-element');
                                    }
                                    
                                    // Select the element
                                    elementToDelete.classList.add('selected-formula-element');
                                    
                                    // Set the global selection info that dynamicBuilderUI.js uses
                                    if (!window.selectedFormulaElementInfo) {
                                        window.selectedFormulaElementInfo = {};
                                    }
                                    window.selectedFormulaElementInfo.domElement = elementToDelete;
                                    window.selectedFormulaElementInfo.premiseId = data.premiseId;
                                    window.selectedFormulaElementInfo.path = data.path || '';
                                    
                                    console.log("Set selectedFormulaElementInfo:", window.selectedFormulaElementInfo);
                                    
                                    // Now trigger deletion using the exact same approach as clicking trash
                                    setTimeout(() => {
                                        console.log("Triggering delete after setting selection");
                                        
                                        // This mimics what happens when you click the trash can
                                        const deleteEvent = new KeyboardEvent('keydown', {
                                            key: 'Delete',
                                            code: 'Delete',
                                            keyCode: 46,
                                            which: 46,
                                            bubbles: true,
                                            cancelable: true
                                        });
                                        document.dispatchEvent(deleteEvent);
                                    }, 50);
                                } else {
                                    console.error("Could not find element to delete");
                                    
                                    // Fallback: use the globally stored reference
                                    if (window.currentlyDraggedElement) {
                                        console.log("Using fallback - globally stored dragged element");
                                        window.currentlyDraggedElement.click();
                                        setTimeout(() => {
                                            const deleteEvent = new KeyboardEvent('keydown', {
                                                key: 'Delete',
                                                code: 'Delete',
                                                keyCode: 46,
                                                which: 46,
                                                bubbles: true,
                                                cancelable: true
                                            });
                                            document.dispatchEvent(deleteEvent);
                                        }, 50);
                                    }
                                }
                            } else {
                                console.log("Dropped item is not a formula element or missing premise ID");
                            }
                        } else {
                            console.log("No drag data available");
                        }
                    } catch (error) {
                        console.error("Error processing drop:", error);
                    }
                    
                    // Clean up any dragging state
                    const draggingItem = document.querySelector('.dragging');
                    if (draggingItem) {
                        draggingItem.classList.remove('dragging');
                    }
                    
                    // Clear global reference
                    window.currentlyDraggedElement = null;
                });
            }
            
            // Add a helper function to delete selected element
            window.deleteSelectedElement = function() {
                // Try to trigger the delete key event in a way that dynamicBuilderUI.js will recognize
                const activeElement = document.activeElement;
                const deleteEvent = new KeyboardEvent('keydown', {
                    key: 'Delete',
                    code: 'Delete',
                    keyCode: 46,
                    which: 46,
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    ctrlKey: false,
                    altKey: false,
                    shiftKey: false,
                    metaKey: false
                });
                
                // Try dispatching on multiple targets
                if (activeElement) {
                    activeElement.dispatchEvent(deleteEvent);
                }
                document.dispatchEvent(deleteEvent);
                window.dispatchEvent(deleteEvent);
            };
            
            // Add functionality to edit proposition text
            window.editPropositionText = function(letter) {
                // Don't allow editing K
                if (letter === 'K') {
                    alert('The main claim (K) cannot be edited here. It was defined when you selected your claim.');
                    return;
                }
                
                // Show a prompt to get the new text
                const currentText = window.statementDefinitions && window.statementDefinitions[letter] ? window.statementDefinitions[letter] : '';
                const newText = prompt(`Enter the statement for ${letter}:`, currentText);
                
                if (newText !== null && newText.trim() !== '') {
                    // Store the definition
                    if (!window.statementDefinitions) {
                        window.statementDefinitions = {};
                    }
                    window.statementDefinitions[letter] = newText.trim();
                    
                    // Update all instances of this letter in the UI
                    updateAllPropositionDisplays();
                    
                    // Make the draggable elements again after re-rendering
                    setTimeout(() => {
                        const makeElementsDraggable = document.querySelector('#premisesContainer').__makeElementsDraggable;
                        if (makeElementsDraggable) {
                            makeElementsDraggable();
                        }
                    }, 100);
                }
            };
            
            // Function to update all proposition displays
            window.updateAllPropositionDisplays = function() {
                // Re-render all premises to show updated text
                if (window.argumentWorkspace && window.argumentWorkspace.premises) {
                    Object.keys(window.argumentWorkspace.premises).forEach(premiseId => {
                        if (window.renderTopLevelPremise && typeof window.renderTopLevelPremise === 'function') {
                            window.renderTopLevelPremise(premiseId);
                        }
                    });
                }
                
                // Update conclusion if it contains K
                const conclusionPlaceholder = document.getElementById('conclusionPlaceholder');
                if (conclusionPlaceholder && window.argumentWorkspace && window.argumentWorkspace.conclusionAST_form) {
                    conclusionPlaceholder.innerHTML = '';
                    
                    if (window.argumentWorkspace.conclusionAST_form.type === 'operator' && 
                        window.argumentWorkspace.conclusionAST_form.operator === 'NOT') {
                        // NOT K case
                        const notSpan = document.createElement('span');
                        notSpan.textContent = 'NOT ';
                        notSpan.style.fontStyle = 'italic';
                        notSpan.style.color = '#dc3545';
                        conclusionPlaceholder.appendChild(notSpan);
                        
                        const kBubble = createEditablePropositionBubble('K', window.statementDefinitions && window.statementDefinitions.K);
                        conclusionPlaceholder.appendChild(kBubble);
                    } else if (window.argumentWorkspace.conclusionAST_form.type === 'proposition') {
                        // Just K case
                        const kBubble = createEditablePropositionBubble('K', window.statementDefinitions && window.statementDefinitions.K);
                        conclusionPlaceholder.appendChild(kBubble);
                    }
                }
                
                // Re-make elements draggable after a short delay
                setTimeout(() => {
                    const makeElementsDraggable = document.querySelector('#premisesContainer').__makeElementsDraggable;
                    if (makeElementsDraggable) {
                        makeElementsDraggable();
                    }
                }, 100);
            };
            
            // Helper function to create an editable proposition bubble
            window.createEditablePropositionBubble = function(letter, text) {
                const bubble = document.createElement('span');
                bubble.className = `palette-item proposition prop-${letter.toLowerCase()}`;
                bubble.style.display = 'inline-block';
                bubble.style.cursor = 'pointer';
                bubble.style.position = 'relative';
                bubble.title = 'Click to edit statement';
                
                // Add hover effect
                bubble.style.transition = 'transform 0.2s';
                bubble.onmouseover = function() {
                    this.style.transform = 'scale(1.1)';
                };
                bubble.onmouseout = function() {
                    this.style.transform = 'scale(1)';
                };
                
                if (text && text.trim() !== '') {
                    // Show text instead of letter
                    bubble.textContent = text.length > 30 ? text.substring(0, 30) + '...' : text;
                    bubble.style.padding = '8px 12px';
                    bubble.style.maxWidth = '200px';
                    bubble.style.whiteSpace = 'nowrap';
                    bubble.style.overflow = 'hidden';
                    bubble.style.textOverflow = 'ellipsis';
                    bubble.title = text; // Show full text on hover
                } else {
                    bubble.textContent = letter;
                }
                
                bubble.onclick = function(e) {
                    e.stopPropagation();
                    window.editPropositionText(letter);
                };
                
                return bubble;
            };
            
            // Simple function to make all propositions editable
            window.makePropositionsEditable = function() {
                // Prevent infinite loops
                if (window.isUpdatingPropositions) return;
                window.isUpdatingPropositions = true;
                
                // Find all proposition bubbles in premises
                const allPropositions = document.querySelectorAll('#premisesContainer .palette-item.proposition, #conclusionPlaceholder .palette-item.proposition');
                
                allPropositions.forEach(prop => {
                    // Skip if already processed
                    if (prop.dataset.editableProcessed === 'true') return;
                    
                    // Get the letter (first character or from the strong tag)
                    let letter = prop.textContent.trim();
                    if (letter.includes(':')) {
                        letter = letter.split(':')[0].trim();
                    }
                    if (letter.length === 1) {
                        // Update display if we have a definition
                        if (window.statementDefinitions && window.statementDefinitions[letter]) {
                            prop.classList.add('with-text');
                            prop.innerHTML = `<strong>${letter}:</strong> ${window.statementDefinitions[letter]}`;
                            prop.title = `${letter}: ${window.statementDefinitions[letter]}`;
                        }
                        
                        // Make it clickable
                        prop.style.cursor = letter === 'K' ? 'default' : 'pointer';
                        prop.onclick = null; // Clear any existing handler
                        prop.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (letter !== 'K') {
                                window.editPropositionText(letter);
                            }
                        });
                        
                        // Mark as processed
                        prop.dataset.editableProcessed = 'true';
                    }
                });
                
                window.isUpdatingPropositions = false;
            };
            
            // Remove the MutationObserver - we'll call makePropositionsEditable manually instead
            const defineStatementsNowButton = document.getElementById('defineStatementsNowButton');
            if (defineStatementsNowButton) {
                defineStatementsNowButton.addEventListener('click', function() {
                    console.log("Define statements button clicked");
                    showStatementDefinitionPanel();
                });
            }
            
            // Function to show statement definition panel
            window.showStatementDefinitionPanel = function() {
                const statementDefArea = document.getElementById('statementDefinitionArea');
                if (!statementDefArea) return;
                
                statementDefArea.style.display = 'block';
                const container = document.getElementById('statementInputsContainer');
                container.innerHTML = '';
                
                // Find all used letters in the argument
                const usedLetters = new Set();
                const premises = window.argumentWorkspace ? window.argumentWorkspace.premises : {};
                
                // Function to find letters in an AST
                function findLettersInAST(ast) {
                    if (!ast) return;
                    if (ast.type === 'proposition') {
                        usedLetters.add(ast.letter);
                    } else if (ast.type === 'operator') {
                        if (ast.operand) findLettersInAST(ast.operand);
                        if (ast.operands) {
                            ast.operands.forEach(op => findLettersInAST(op));
                        }
                    }
                }
                
                // Search all premises
                Object.values(premises).forEach(premise => {
                    findLettersInAST(premise);
                });
                
                // Always include K
                usedLetters.add('K');
                
                // Create input fields for each used letter
                const sortedLetters = Array.from(usedLetters).sort();
                sortedLetters.forEach(letter => {
                    const div = document.createElement('div');
                    div.style.marginBottom = '15px';
                    
                    const label = document.createElement('label');
                    label.textContent = `Statement ${letter}: `;
                    label.style.fontWeight = 'bold';
                    label.style.display = 'block';
                    label.style.marginBottom = '5px';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = `statement-${letter}`;
                    input.style.width = '100%';
                    input.style.padding = '8px';
                    input.style.border = '1px solid #ccc';
                    input.style.borderRadius = '4px';
                    
                    // Pre-fill if we already have a definition
                    if (window.statementDefinitions && window.statementDefinitions[letter]) {
                        input.value = window.statementDefinitions[letter];
                    }
                    
                    // K should be read-only
                    if (letter === 'K') {
                        input.value = window.mainClaimText || '';
                        input.readOnly = true;
                        input.style.backgroundColor = '#f0f0f0';
                    }
                    
                    div.appendChild(label);
                    div.appendChild(input);
                    container.appendChild(div);
                });
                
                // Scroll to the definition area
                statementDefArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };
            
            // Handle submit button for dynamic arguments
            const submitDynamicArgumentButton = document.getElementById('submitDynamicArgumentButton');
            if (submitDynamicArgumentButton) {
                submitDynamicArgumentButton.addEventListener('click', function() {
                    console.log("Submit dynamic argument clicked");
                    
                    // Collect all statement definitions
                    const inputs = document.querySelectorAll('#statementInputsContainer input');
                    const definitions = {};
                    let allFilled = true;
                    
                    inputs.forEach(input => {
                        const letter = input.id.replace('statement-', '');
                        definitions[letter] = input.value.trim();
                        if (!definitions[letter] && letter !== 'K') {
                            allFilled = false;
                        }
                    });
                    
                    if (!allFilled) {
                        alert('Please define all statements before submitting.');
                        return;
                    }
                    
                    // Store definitions globally
                    window.statementDefinitions = definitions;
                    
                    // Prepare argument for submission
                    const argumentTitle = document.getElementById('dynamicArgumentTitle').value || 'Untitled Argument';
                    
                    // Convert premises to readable format
                    const argumentLines = [];
                    const premises = window.argumentWorkspace ? window.argumentWorkspace.premises : {};
                    
                    // Function to convert AST to readable string
                    function astToReadableString(ast) {
                        if (!ast) return '[empty]';
                        if (ast.type === 'proposition') {
                            return `<strong>${ast.letter}</strong>: ${definitions[ast.letter] || `[${ast.letter}]`}`;
                        } else if (ast.type === 'operator') {
                            if (ast.operator === 'NOT') {
                                return `NOT (${astToReadableString(ast.operand)})`;
                            } else if (ast.operator === 'IFTHEN') {
                                return `IF (${astToReadableString(ast.operands[0])}) THEN (${astToReadableString(ast.operands[1])})`;
                            } else {
                                return `(${astToReadableString(ast.operands[0])}) ${ast.operator} (${astToReadableString(ast.operands[1])})`;
                            }
                        }
                        return '[unknown]';
                    }
                    
                    // Add each premise
                    Object.keys(premises).sort().forEach(premiseId => {
                        if (premises[premiseId]) {
                            argumentLines.push(astToReadableString(premises[premiseId]));
                        }
                    });
                    
                    // Add conclusion
                    const conclusion = window.argumentWorkspace && window.argumentWorkspace.conclusionAST_form 
                        ? astToReadableString(window.argumentWorkspace.conclusionAST_form)
                        : `<strong>K</strong>: ${definitions.K || '[K]'}`;
                    argumentLines.push(`Therefore: ${conclusion}`);
                    
                    // Submit to Firebase
                    const user = firebase.auth().currentUser;
                    if (!user) {
                        alert('You must be logged in to submit an argument.');
                        return;
                    }
                    
                    const argumentData = {
                        title: argumentTitle,
                        claimText: window.mainClaimText,
                        stanceText: selectedStanceForK,
                        argumentLines: argumentLines,
                        premiseURLs: {}, // TODO: Add URL support
                        endorsements: 0,
                        disagreements: 0,
                        endorsementPercentage: 0,
                        userId: user.uid,
                        userEmail: user.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    db.collection('arguments').add(argumentData)
                        .then(() => {
                            alert('Argument submitted successfully!');
                            // Reset the form
                            location.reload();
                        })
                        .catch((error) => {
                            console.error('Error submitting argument:', error);
                            alert('Error submitting argument: ' + error.message);
                        });
                });
            }
            
            // Handle validation button
            const checkFormValidityButton = document.getElementById('checkFormValidityButton');
            if (checkFormValidityButton) {
                checkFormValidityButton.addEventListener('click', function() {
                    console.log("Validate button clicked");
                    
                    // Get all premises ASTs
                    const premiseASTs = [];
                    const premises = window.argumentWorkspace ? window.argumentWorkspace.premises : {};
                    
                    // Debug logging
                    console.log("All premises in workspace:", premises);
                    
                    Object.keys(premises).sort().forEach(premiseId => {
                        if (premises[premiseId]) {
                            console.log(`Premise ${premiseId}:`, JSON.stringify(premises[premiseId]));
                            premiseASTs.push(premises[premiseId]);
                        }
                    });
                    
                    // Get conclusion AST
                    const conclusionAST = window.argumentWorkspace && window.argumentWorkspace.conclusionAST_form 
                        ? window.argumentWorkspace.conclusionAST_form 
                        : { type: 'proposition', letter: 'K' };
                    
                    console.log("Premises being validated:", premiseASTs);
                    console.log("Conclusion being validated:", conclusionAST);
                    
                    // Check if we have the validation function
                    if (typeof isArgumentFormValid === 'function') {
                        const isValid = isArgumentFormValid(premiseASTs, conclusionAST);
                        
                        const resultDiv = document.getElementById('validityResult');
                        if (resultDiv) {
                            if (isValid) {
                                resultDiv.innerHTML = '<span style="color: green;">✓ This argument form is VALID!</span>';
                            } else {
                                resultDiv.innerHTML = '<span style="color: red;">✗ This argument form is INVALID. There exists a case where all premises are true but the conclusion is false.</span>';
                                
                                // Let's also show a counterexample
                                const usedLetters = new Set();
                                
                                // Find all letters in premises and conclusion
                                function findLetters(ast) {
                                    if (!ast) return;
                                    if (ast.type === 'proposition') {
                                        usedLetters.add(ast.letter);
                                    } else if (ast.type === 'operator') {
                                        if (ast.operand) findLetters(ast.operand);
                                        if (ast.operands) ast.operands.forEach(findLetters);
                                    }
                                }
                                
                                premiseASTs.forEach(findLetters);
                                findLetters(conclusionAST);
                                
                                // Try to find a counterexample
                                const letters = Array.from(usedLetters).sort();
                                const totalAssignments = Math.pow(2, letters.length);
                                
                                // Check if we have access to evaluateFormula
                                if (typeof evaluateFormula === 'function') {
                                    for (let i = 0; i < totalAssignments; i++) {
                                        const assignment = {};
                                        for (let j = 0; j < letters.length; j++) {
                                            assignment[letters[j]] = ((i >> j) & 1) === 1;
                                        }
                                        
                                        // Check if all premises are true
                                        let allPremisesTrue = premiseASTs.every(premise => 
                                            evaluateFormula(premise, assignment)
                                        );
                                        
                                        if (allPremisesTrue && !evaluateFormula(conclusionAST, assignment)) {
                                            // Found a counterexample
                                            const counterexampleText = letters.map(letter => 
                                                `${letter}=${assignment[letter] ? 'true' : 'false'}`
                                            ).join(', ');
                                            
                                            resultDiv.innerHTML += `<br><span style="color: #666; font-size: 14px;">Counterexample: ${counterexampleText}</span>`;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        alert('Validation engine not loaded properly.');
                    }
                });
            }
            
            // We'll observe changes to the premisesContainer to make new elements draggable
            const premisesContainer = document.getElementById('premisesContainer');
            if (premisesContainer) {
                const makeElementsDraggable = function() {
                    const formulaElements = premisesContainer.querySelectorAll('.formula-element-wrapper');
                    console.log(`Making ${formulaElements.length} formula elements draggable`);
                    
                    formulaElements.forEach(element => {
                        if (!element.hasAttribute('draggable')) {
                            element.setAttribute('draggable', 'true');
                            element.style.cursor = 'move';
                            
                            element.addEventListener('dragstart', function(e) {
                                e.stopPropagation();
                                this.classList.add('dragging');
                                this.style.opacity = '0.5';
                                
                                // Store the element info in dataTransfer
                                const premiseId = this.dataset.premiseId || '';
                                const path = this.dataset.path || '';
                                const dragData = {
                                    type: 'formula-element',
                                    premiseId: premiseId,
                                    path: path
                                };
                                
                                console.log("Dragging element:", dragData);
                                console.log("Element dataset:", this.dataset);
                                e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                                e.dataTransfer.setData('text/plain', `${premiseId}|${path}`); // Backup format
                                e.dataTransfer.effectAllowed = 'move';
                                
                                // Store reference globally as backup
                                window.currentlyDraggedElement = this;
                                
                                // Also click to select it
                                this.click();
                            });
                            
                            element.addEventListener('dragend', function(e) {
                                this.classList.remove('dragging');
                                this.style.opacity = '';
                            });
                        }
                    });
                };
                
                // Store the function reference on the container element
                premisesContainer.__makeElementsDraggable = makeElementsDraggable;
                
                // Initial setup
                setTimeout(makeElementsDraggable, 100);
                
                // Watch for changes
                const observer = new MutationObserver(function(mutations) {
                    makeElementsDraggable();
                });
                
                observer.observe(premisesContainer, {
                    childList: true,
                    subtree: true
                });
            }
        });
    </script>

    <script>
        console.log("Script 2: Starting main script");
        
        // Complete claims data
        const claimsByCategory = {
            "Politics & Governance": { 
                "Electoral Systems & Reform": [ { value: 'pol_esr_001', text: 'Compulsory voting should be implemented in all democratic nations.' }, { value: 'pol_esr_002', text: 'Lowering the voting age to 16 would enhance civic engagement.' }, { value: 'pol_esr_003', text: 'Proportional representation electoral systems are fairer than first-past-the-post systems.' }, { value: 'pol_esr_004', text: 'Strict campaign finance limits are essential for reducing political corruption.' }, { value: 'pol_esr_005', text: 'Online voting systems are secure enough for widespread use in national elections.' } ],
                "Civil Rights & Liberties": [ { value: 'pol_crl_001', text: 'Freedom of speech should have no limitations, even for hate speech.' }, { value: 'pol_crl_002', text: 'Government surveillance of citizens is justified for national security purposes.' }, { value: 'pol_crl_003', text: 'The right to privacy is more important than the needs of law enforcement.' }, { value: 'pol_crl_004', text: 'Affirmative action policies are necessary to address historical injustices.' }, { value: 'pol_crl_005', text: 'Citizens should have the right to bear arms with minimal restrictions.' } ],
                "Political Ideologies": [ { value: 'pol_pid_001', text: 'Socialism offers a more equitable societal structure than capitalism.' }, { value: 'pol_pid_002', text: 'Libertarianism provides the optimal balance of individual freedom and limited government.' }, { value: 'pol_pid_003', text: 'Nationalism is a detrimental force in international relations.' }, { value: 'pol_pid_004', text: 'A global governing body would be beneficial for humanity.' } ]
            },
            "Technology & Innovation": { 
                "Artificial Intelligence": [ { value: 'tec_ai_001', text: 'The development of artificial general intelligence (AGI) poses an existential threat to humanity.' }, { value: 'tec_ai_002', text: 'AI will create more jobs than it eliminates in the long run.' }, { value: 'tec_ai_003', text: 'Governments should heavily regulate AI development to prevent misuse.' }, { value: 'tec_ai_004', text: 'AI-driven decision-making in areas like criminal justice can be free of human bias.' }, { value: 'tec_ai_005', text: 'Consciousness can emerge in advanced AI systems.' } ],
                "Internet & Digital Society": [ { value: 'tec_ids_001', text: 'Social media platforms have a net negative impact on society.' }, { value: 'tec_ids_002', text: 'Net neutrality is essential for a fair and open internet.' }, { value: 'tec_ids_003', text: 'Online anonymity does more harm than good.' }, { value: 'tec_ids_004', text: 'The spread of misinformation online can only be solved by platform censorship.' }, { value: 'tec_ids_005', text: 'Decentralized web technologies (Web3) will fundamentally change the internet.' } ],
                "Biotechnology & Futurism": [ { value: 'tec_bio_001', text: 'Genetic engineering of humans should be pursued to enhance capabilities.' }, { value: 'tec_bio_002', text: 'Cryonics (freezing bodies for future revival) is a plausible path to life extension.' }, { value: 'tec_bio_003', text: 'Widespread adoption of lab-grown meat is inevitable and beneficial.' }, { value: 'tec_bio_004', text: 'Human colonization of other planets is essential for the long-term survival of the species.' } ]
            },
            "Environment & Sustainability": { 
                "Climate Change": [ { value: 'env_cc_001', text: 'Global carbon emissions must reach net-zero by 2050 to avoid catastrophic climate change.' }, { value: 'env_cc_002', text: 'Individual lifestyle changes are more critical than government policies in combating climate change.' }, { value: 'env_cc_003', text: 'Nuclear power is a necessary component of a low-carbon energy future.' }, { value: 'env_cc_004', text: 'Carbon capture technologies are a viable solution to significantly reduce atmospheric CO2.' }, { value: 'env_cc_005', text: 'The economic costs of transitioning to a green economy outweigh the benefits.' } ],
                "Conservation & Resources": [ { value: 'env_cr_001', text: 'Protecting biodiversity should take precedence over economic development.' }, { value: 'env_cr_002', text: 'Freshwater will become a more significant source of conflict than oil in the future.' }, { value: 'env_cr_003', text: 'Trophy hunting can be a legitimate tool for wildlife conservation funding.' }, { value: 'env_cr_004', text: 'Humans have a moral obligation to prevent the extinction of any species.' } ],
                "Sustainable Living": [ { value: 'env_sl_001', text: 'A global shift to a primarily plant-based diet is essential for environmental sustainability.' }, { value: 'env_sl_002', text: 'Minimalism as a lifestyle is a key to reducing environmental impact.' }, { value: 'env_sl_003', text: 'Circular economies are the only long-term solution to resource depletion.' }, { value: 'env_sl_004', text: 'Consumerism is inherently incompatible with environmental sustainability.' } ]
            },
            "Culture & Society": { 
                "Media & Information": [ { value: 'cul_mi_001', text: 'Traditional news media is inherently biased and no longer trustworthy.' }, { value: 'cul_mi_002', text: 'Citizen journalism does more to inform the public than professional journalism.' }, { value: 'cul_mi_003', text: 'Fact-checking initiatives are effective at combating misinformation.' }, { value: 'cul_mi_004', text: 'The 24/7 news cycle has a detrimental effect on public discourse and mental health.' }, { value: 'cul_mi_005', text: 'Algorithms used by social media platforms create echo chambers that polarize society.' } ],
                "Social Norms & Traditions": [ { value: 'cul_snt_001', text: 'Traditional gender roles are oppressive and should be dismantled entirely.' }, { value: 'cul_snt_002', text: 'Cultural appropriation is harmful and should always be avoided.' }, { value: 'cul_snt_003', text: 'Monogamy is an outdated concept for modern relationships.' }, { value: 'cul_snt_004', text: 'Societal pressure to conform to beauty standards is a primary source of unhappiness.' }, { value: 'cul_snt_005', text: 'Cancel culture is a necessary tool for social accountability.' } ],
                "Arts & Humanities": [ { value: 'cul_ah_001', text: 'Government funding for the arts is a waste of taxpayer money.' }, { value: 'cul_ah_002', text: 'Classical art forms (e.g., opera, ballet) are irrelevant to contemporary society.' }, { value: 'cul_ah_003', text: 'The primary purpose of art should be to provoke social or political change.' }, { value: 'cul_ah_004', text: 'Video games should be considered a legitimate art form on par with film or literature.' }, { value: 'cul_ah_005', text: 'Studying humanities is essential for developing critical thinking and empathy.' } ],
                "Religion & Spirituality": [ { value: 'cul_rs_001', text: 'Organized religion has a net negative impact on human progress.' }, { value: 'cul_rs_002', text: 'Religious belief is incompatible with a scientific worldview.' }, { value: 'cul_rs_003', text: 'Secularism in government is the only way to ensure religious freedom for all.' }, { value: 'cul_rs_004', text: 'Spiritual experiences are valid even without a belief in a deity.' }, { value: 'cul_rs_005', text: 'Religious texts should be interpreted literally.' } ]
            },
            "Health & Wellness": { 
                "Healthcare Systems & Policy": [ { value: 'hea_hsp_001', text: 'Universal healthcare, funded by taxes, is the most ethical way to provide medical services.' }, { value: 'hea_hsp_002', text: 'Pharmaceutical companies should have their drug prices heavily regulated by the government.' }, { value: 'hea_hsp_003', text: 'Preventive healthcare should receive significantly more funding than treatment-focused care.' }, { value: 'hea_hsp_004', text: 'Individuals should have the right to refuse any mandatory medical treatment, including vaccines.' }, { value: 'hea_hsp_005', text: 'The privatization of healthcare leads to better quality and innovation.' } ],
                "Medical Ethics & Research": [ { value: 'hea_mer_001', text: 'Animal testing for medical research is a necessary evil.' }, { value: 'hea_mer_002', text: 'Human cloning, even for therapeutic purposes, is unethical.' }, { value: 'hea_mer_003', text: 'Physician-assisted suicide should be a legal option for terminally ill patients.' }, { value: 'hea_mer_004', text: 'Placebos should never be used in clinical trials if an existing treatment is available.' }, { value: 'hea_mer_005', text: 'Genetic data from individuals should be freely available for medical research without explicit consent for each use.' } ],
                "Nutrition & Diet": [ { value: 'hea_nd_006', text: 'Government regulation of unhealthy foods (e.g., sugar tax) is an infringement on personal liberty.' }, { value: 'hea_nd_007', text: 'Most dietary supplements offer no significant health benefits for the average person.' }, { value: 'hea_nd_008', text: 'Intermittent fasting is a superior method for weight loss and health compared to traditional calorie restriction.' } ],
                "Mental Health & Psychiatry": [ { value: 'hea_mhp_006', text: 'Over-diagnosis is a significant problem in modern psychiatry.' }, { value: 'hea_mhp_007', text: 'Psychedelic-assisted therapy should be legalized for treating mental health conditions.' }, { value: 'hea_mhp_008', text: 'Social media usage is a primary driver of increasing rates of anxiety and depression in youth.' } ]
            },
            "History": { 
                "Ancient Civilizations": [ { value: 'his_ac_006', text: 'The Roman Empire\'s fall was primarily due to internal decay rather than external pressures.' }, { value: 'his_ac_007', text: 'Ancient Athens provided a better model for democracy than modern representative democracies.' } ],
                "Modern Era": [ { value: 'his_me_006', text: 'The outcome of World War I inevitably led to World War II.' }, { value: 'his_me_007', text: 'The Enlightenment had a greater impact on shaping the modern world than the Renaissance.' } ],
                "Historical Interpretation": [ { value: 'his_hi_001', text: 'History is always written by the victors, making objective truth unattainable.' }, { value: 'his_hi_002', text: 'Present-day moral standards should not be used to judge historical figures.' }, { value: 'his_hi_003', text: 'Studying history is crucial for understanding and solving contemporary problems.' } ]
            },
            "Philosophy & Ethics": { 
                "Applied Ethics": [ { value: 'phi_ae_001', text: 'Vegetarianism or veganism is a moral imperative.' }, { value: 'phi_ae_002', text: 'Capitalism is inherently an unethical system.' }, { value: 'phi_ae_003', text: 'Artificial intelligence should be granted rights if it achieves sentience.' }, { value: 'phi_ae_004', text: 'Whistleblowing is always ethically justified when exposing wrongdoing, regardless of consequences.' } ],
                "Political Philosophy": [ { value: 'phi_pp_001', text: 'The primary role of the state is to ensure the welfare of its citizens.' }, { value: 'phi_pp_002', text: 'Anarchism is a viable and desirable political system.' }, { value: 'phi_pp_003', text: 'Individuals have a moral obligation to disobey unjust laws.' } ]
            },
            "Economics & Business": {
                "Economic Systems": [ { value: 'eco_es_001', text: 'Pure free-market capitalism leads to the greatest overall prosperity.' }, { value: 'eco_es_002', text: 'A universal basic income (UBI) is a feasible solution to poverty and automation-driven job loss.' }, { value: 'eco_es_003', text: 'Key industries like energy and healthcare should be nationalized.' }, { value: 'eco_es_004', text: 'Economic growth should no longer be the primary goal of developed nations.' } ],
                "Labor & Employment": [ { value: 'eco_le_001', text: 'Strong labor unions are essential for protecting workers\' rights and wages.' }, { value: 'eco_le_002', text: 'The gig economy exploits workers more than it empowers them.' }, { value: 'eco_le_003', text: 'A federally mandated minimum wage harms employment rates for low-skilled workers.' }, { value: 'eco_le_004', text: 'Automation will inevitably lead to widespread, long-term unemployment.' } ],
                "Global Trade & Finance": [ { value: 'eco_gtf_001', text: 'Protectionist trade policies ultimately harm the domestic economy.' }, { value: 'eco_gtf_002', text: 'Cryptocurrencies will eventually replace traditional fiat currencies.' }, { value: 'eco_gtf_003', text: 'The World Bank and IMF do more harm than good in developing nations.' } ],
                "Corporate Ethics & Responsibility": [ { value: 'eco_cer_001', text: 'The sole responsibility of a business is to maximize profits for its shareholders.' }, { value: 'eco_cer_002', text: 'Corporations should be legally mandated to prioritize environmental and social impacts.' }, { value: 'eco_cer_003', text: 'Executive compensation in large corporations is excessively high and unjustified.' } ]
            },
            "Education System": { 
                "Curriculum & Pedagogy": [ { value: 'edu_cp_001', text: 'Standardized curricula hinder creativity and critical thinking in students.' }, { value: 'edu_cp_002', text: 'Education should focus more on vocational skills than liberal arts.' }, { value: 'edu_cp_003', text: 'Inquiry-based learning is more effective than direct instruction for long-term knowledge retention.' }, { value: 'edu_cp_004', text: 'Sex education should be comprehensive and mandatory from an early age in schools.' } ],
                "Assessment & Standards": [ { value: 'edu_as_001', text: 'Standardized testing is an accurate and fair measure of student ability and school performance.' }, { value: 'edu_as_002', text: 'Letter grades should be abolished in favor of more holistic assessment methods.' }, { value: 'edu_as_003', text: 'Social promotion (advancing students regardless of academic performance) is detrimental to education.' } ],
                "Higher Education": [ { value: 'edu_he_001', text: 'College education in [Country - e.g., the US] is unaffordable for the average person and needs radical reform.' }, { value: 'edu_he_002', text: 'A university degree is no longer a guarantee of a successful career.' }, { value: 'edu_he_003', text: 'Tenure for university professors should be abolished.' }, { value: 'edu_he_004', text: 'Online universities can provide an education of equal quality to traditional brick-and-mortar institutions.' } ],
                "Role of Technology in Education": [ { value: 'edu_te_001', text: 'Replacing textbooks with tablets or laptops in K-12 education is beneficial for learning.' }, { value: 'edu_te_002', text: 'AI tutors can be more effective than human tutors for certain subjects.' }, { value: 'edu_te_003', text: 'Increased screen time due to educational technology is harming childrens development.' } ]
            }
        };
        
        console.log("Script 2: Claims data defined");

        // Function to set up the dynamic builder
        function setupDynamicBuilderExternal(claimText, stance, claimLetter) {
            console.log("LOG: setupDynamicBuilderExternal called with:", claimText, stance, claimLetter);
            
            // Store the claim text globally for later use
            window.mainClaimText = claimText;
            window.statementDefinitions = { K: claimText };
            
            // Initialize argumentWorkspace if it doesn't exist
            if (!window.argumentWorkspace) {
                window.argumentWorkspace = {
                    premises: {},
                    conclusionAST_form: null
                };
            }
            
            // Set the conclusion AST based on stance
            if (stance === 'Against') {
                window.argumentWorkspace.conclusionAST_form = {
                    type: 'operator',
                    operator: 'NOT',
                    operand: { type: 'proposition', letter: 'K', colorClass: 'prop-k' }
                };
            } else {
                window.argumentWorkspace.conclusionAST_form = {
                    type: 'proposition',
                    letter: 'K',
                    colorClass: 'prop-k'
                };
            }
            
            // Update the conclusion placeholder
            const conclusionPlaceholder = document.getElementById('conclusionPlaceholder');
            if (conclusionPlaceholder) {
                conclusionPlaceholder.innerHTML = ''; // Clear existing content
                
                if (stance === 'Against') {
                    // Create NOT text
                    const notSpan = document.createElement('span');
                    notSpan.textContent = 'NOT ';
                    notSpan.style.fontStyle = 'italic';
                    notSpan.style.color = '#dc3545';
                    conclusionPlaceholder.appendChild(notSpan);
                    
                    // Create K bubble with text
                    const kBubble = window.createEditablePropositionBubble ? 
                        window.createEditablePropositionBubble('K', claimText) : 
                        document.createElement('span');
                    if (!window.createEditablePropositionBubble) {
                        kBubble.className = 'palette-item proposition prop-k';
                        kBubble.textContent = 'K';
                        kBubble.style.display = 'inline-block';
                        kBubble.style.cursor = 'default';
                    }
                    conclusionPlaceholder.appendChild(kBubble);
                } else {
                    // Just create K bubble with text
                    const kBubble = window.createEditablePropositionBubble ? 
                        window.createEditablePropositionBubble('K', claimText) : 
                        document.createElement('span');
                    if (!window.createEditablePropositionBubble) {
                        kBubble.className = 'palette-item proposition prop-k';
                        kBubble.textContent = 'K';
                        kBubble.style.display = 'inline-block';
                        kBubble.style.cursor = 'default';
                    }
                    conclusionPlaceholder.appendChild(kBubble);
                }
            }
            
            // Update the display elements
            const displayMainClaimK = document.getElementById('displayMainClaimK');
            if (displayMainClaimK) {
                displayMainClaimK.textContent = claimText;
            }
            
            const displayStanceOnK = document.getElementById('displayStanceOnK');
            if (displayStanceOnK) {
                displayStanceOnK.textContent = stance.toUpperCase();
            }
            
            console.log("LOG: Dynamic builder setup completed");
            
            // Start making propositions editable
            setTimeout(() => {
                if (window.makePropositionsEditable) {
                    window.makePropositionsEditable();
                }
            }, 100);
        }

        // All the main functions
        function initializeAndShowDynamicBuilder() {
            const claimSelect = document.getElementById('claimSelect');
            const stanceSelect = document.getElementById('stanceSelect');

            if (!claimSelect || claimSelect.value === "") {
                alert("Please select the Main Claim (K) you will argue about from the dropdowns.");
                if (claimSelect) claimSelect.focus(); 
                return;
            }
            if (!stanceSelect || stanceSelect.value === "") {
                alert("Please select your Stance on this claim from the dropdowns.");
                if (stanceSelect) stanceSelect.focus(); 
                return;
            }

            selectedClaimTextForK = claimSelect.options[claimSelect.selectedIndex].text;
            selectedStanceForK = stanceSelect.value; 

            console.log(`LOG: Initializing dynamic builder. Claim (K): "${selectedClaimTextForK}", Stance: ${selectedStanceForK}`);

            const displayMainClaimKEl = document.getElementById('displayMainClaimK');
            if (displayMainClaimKEl) displayMainClaimKEl.textContent = selectedClaimTextForK;
            const displayStanceOnKEl = document.getElementById('displayStanceOnK');
            if (displayStanceOnKEl) displayStanceOnKEl.textContent = selectedStanceForK.toUpperCase();

            if (typeof setupDynamicBuilderExternal === "function") {
                setupDynamicBuilderExternal(selectedClaimTextForK, selectedStanceForK, 'K'); 
                
                const claimSetupForm = document.getElementById('claimSetupForm');
                if(claimSetupForm) claimSetupForm.style.display = 'none';

                const dynamicBuilderSection = document.getElementById('dynamicArgumentBuilder');
                if (dynamicBuilderSection) dynamicBuilderSection.style.display = 'block'; 
                
                console.log("LOG: Dynamic builder setup initiated and should be visible.");
            } else {
                console.error("LOG: CRITICAL - setupDynamicBuilderExternal function not found!");
                alert("Error: Could not initialize the dynamic argument builder.");
            }
        }

        function displayArguments() {
            const argumentsList = document.getElementById('argumentsList');
            if (!argumentsList) return;
            
            argumentsList.innerHTML = '';

            const rankingMethod = document.getElementById('rankingSelect').value;
            const claimFilter = document.getElementById('filterClaimSelect').value;
            const stanceFilter = document.getElementById('filterStanceSelect').value;

            let query = db.collection('arguments');

            // Apply filters
            if (claimFilter) {
                query = query.where('claimText', '==', claimFilter);
            }
            if (stanceFilter) {
                query = query.where('stanceText', '==', stanceFilter);
            }

            // Add ordering
            if (rankingMethod === 'mostEndorsed') {
                query = query.orderBy('endorsements', 'desc');
            } else if (rankingMethod === 'highestPercentage') {
                query = query.orderBy('endorsementPercentage', 'desc');
            } else { // mostRecent
                query = query.orderBy('createdAt', 'desc');
            }

            // Fetch and render arguments
            query.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const argumentObj = doc.data();
                    argumentObj.id = doc.id;

                    // Render argument
                    const argumentDiv = document.createElement('div');
                    argumentDiv.className = 'argument';
                    argumentDiv.dataset.id = argumentObj.id;

                    const argumentHeader = document.createElement('div');
                    argumentHeader.className = 'argument-header';

                    const stanceIcon = document.createElement('i');
                    stanceIcon.className = 'argument-icon ' + (argumentObj.stanceText === 'For' ? 'fas fa-thumbs-up' : 'fas fa-thumbs-down');

                    const argumentTitle = document.createElement('h3');
                    argumentTitle.className = 'argument-title';
                    argumentTitle.textContent = argumentObj.title;

                    argumentHeader.appendChild(stanceIcon);
                    argumentHeader.appendChild(argumentTitle);

                    const claimElement = document.createElement('p');
                    claimElement.innerHTML = `<strong>Claim (${argumentObj.stanceText}):</strong> ${argumentObj.claimText}`;
                    claimElement.style.marginTop = '15px';
                    claimElement.style.fontSize = '20px';
                    claimElement.style.color = '#555';

                    const argumentContentDiv = document.createElement('div');
                    argumentContentDiv.className = 'argument-content';

                    const ol = document.createElement('ol');

                    argumentObj.argumentLines.forEach((line, index) => {
                        const li = document.createElement('li');

                        const premiseText = document.createElement('span');
                        premiseText.className = 'premise-text';
                        premiseText.innerHTML = line;

                        li.appendChild(premiseText);

                        // Add URL next to the premise if available
                        if (argumentObj.premiseURLs && argumentObj.premiseURLs[index]) {
                            const urlLink = document.createElement('a');
                            urlLink.href = argumentObj.premiseURLs[index];
                            urlLink.target = '_blank';
                            urlLink.rel = 'noopener noreferrer';
                            urlLink.textContent = 'Evidence';
                            urlLink.className = 'premise-url';
                            li.appendChild(urlLink);
                        }

                        // Add buttons
                        if (index < argumentObj.argumentLines.length - 1) {
                            const disagreeButton = document.createElement('button');
                            disagreeButton.textContent = 'Disagree with this premise';
                            disagreeButton.className = 'disagree-premise-button';
                            disagreeButton.onclick = function() {
                                var user = firebase.auth().currentUser;
                                if (!user) {
                                    alert('You must be logged in to disagree with a premise.');
                                    return;
                                }
                                updateDisagreement(argumentObj.id);
                            };
                            li.appendChild(disagreeButton);
                        } else {
                            const endorseButton = document.createElement('button');
                            endorseButton.textContent = 'Endorse Conclusion';
                            endorseButton.className = 'endorse-conclusion-button';
                            endorseButton.onclick = function() {
                                var user = firebase.auth().currentUser;
                                if (!user) {
                                    alert('You must be logged in to endorse the conclusion.');
                                    return;
                                }
                                updateEndorsement(argumentObj.id);
                            };
                            li.appendChild(document.createElement('br'));
                            li.appendChild(endorseButton);
                        }

                        ol.appendChild(li);
                    });

                    argumentContentDiv.appendChild(ol);

                    // Display endorsement stats
                    const endorsementStats = document.createElement('div');
                    endorsementStats.className = 'endorsement-stats';
                    endorsementStats.textContent = `Endorsements: ${argumentObj.endorsements || 0} | Disagreements: ${argumentObj.disagreements || 0} | Endorsement Percentage: ${argumentObj.endorsementPercentage ? argumentObj.endorsementPercentage.toFixed(2) : 0}%`;

                    argumentDiv.appendChild(argumentHeader);
                    argumentDiv.appendChild(claimElement);
                    argumentDiv.appendChild(argumentContentDiv);
                    argumentDiv.appendChild(endorsementStats);

                    argumentsList.appendChild(argumentDiv);
                });
            }).catch((error) => {
                console.error("Error getting documents: ", error);
            });
        }

        function updateEndorsement(argumentId) {
            const argumentRef = db.collection('arguments').doc(argumentId);
            db.runTransaction((transaction) => {
                return transaction.get(argumentRef).then((doc) => {
                    if (!doc.exists) {
                        throw "Argument does not exist!";
                    }
                    const newEndorsements = (doc.data().endorsements || 0) + 1;
                    const disagreements = doc.data().disagreements || 0;
                    const totalVotes = newEndorsements + disagreements;
                    const endorsementPercentage = totalVotes > 0 ? (100 * newEndorsements) / totalVotes : 0;
                    transaction.update(argumentRef, {
                        endorsements: newEndorsements,
                        endorsementPercentage: endorsementPercentage
                    });
                });
            }).then(() => {
                alert('You endorsed the conclusion.');
                displayArguments();
            }).catch((error) => {
                console.error("Transaction failed: ", error);
                alert("Error endorsing: " + error);
            });
        }

        function updateDisagreement(argumentId) {
            const argumentRef = db.collection('arguments').doc(argumentId);
            db.runTransaction((transaction) => {
                return transaction.get(argumentRef).then((doc) => {
                    if (!doc.exists) {
                        throw "Argument does not exist!";
                    }
                    const newDisagreements = (doc.data().disagreements || 0) + 1;
                    const endorsements = doc.data().endorsements || 0;
                    const totalVotes = newDisagreements + endorsements;
                    const endorsementPercentage = totalVotes > 0 ? (100 * endorsements) / totalVotes : 0;
                    transaction.update(argumentRef, {
                        disagreements: newDisagreements,
                        endorsementPercentage: endorsementPercentage
                    });
                });
            }).then(() => {
                alert('You disagreed with a premise.');
                displayArguments();
            }).catch((error) => {
                console.error("Transaction failed: ", error);
                alert("Error Disagreeing: " + error);
            });
        }
        
        function populateFilterClaims() {
            const filterClaimSelect = document.getElementById('filterClaimSelect');
            if (!filterClaimSelect) return;
            
            filterClaimSelect.innerHTML = '<option value="">-- All Claims --</option>';
            const claimsSet = new Set();

            // Collect all claims
            for (const category in claimsByCategory) {
                for (const subcategory in claimsByCategory[category]) {
                    claimsByCategory[category][subcategory].forEach(claim => {
                        claimsSet.add(claim.text);
                    });
                }
            }

            // Add claims to the select element
            claimsSet.forEach(claimText => {
                const option = document.createElement('option');
                option.value = claimText;
                option.textContent = claimText;
                filterClaimSelect.appendChild(option);
            });
        }

        // Stubs for old functions
        function displayArgumentForms(stance) { console.log("Old displayArgumentForms called - Templates disabled."); }
        function generatePlaceholderInputs(form) { console.log("Old generatePlaceholderInputs called - Templates disabled."); }
        function createVariableRectangles(text, placeholderValues, isForm = false) { return text; }
        function constructArgument(form, placeholderValues) { return []; }
        function collectPremiseURLs(form) { return {}; }
        function validateArgument(form, placeholderValues) { return true; } 

        // Wait for DOM to be ready
        function initializeApp() {
            console.log("Script 2: initializeApp called");
            
            // Populate category dropdown
            const categorySelect = document.getElementById('categorySelect');
            if (categorySelect) {
                console.log("Script 2: Found categorySelect element");
                for (const category in claimsByCategory) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                }
                console.log("Script 2: Categories populated");
                
                // Set up category change listener
                categorySelect.addEventListener('change', function() {
                    const subcategorySelect = document.getElementById('subcategorySelect');
                    const claimSelect = document.getElementById('claimSelect');
                    
                    subcategorySelect.innerHTML = '<option value="">-- Choose a Subcategory --</option>';
                    claimSelect.innerHTML = '<option value="">-- Choose a Claim --</option>';
                    
                    const selectedCategory = this.value;
                    if (selectedCategory && claimsByCategory[selectedCategory]) {
                        for (const subcategory in claimsByCategory[selectedCategory]) {
                            const option = document.createElement('option');
                            option.value = subcategory;
                            option.textContent = subcategory;
                            subcategorySelect.appendChild(option);
                        }
                    }
                    
                    // Reset subsequent selections
                    const stanceSelect = document.getElementById('stanceSelect');
                    if(stanceSelect) stanceSelect.value = "";
                    document.getElementById('dynamicArgumentBuilder').style.display = 'none';
                    const statementDefArea = document.getElementById('statementDefinitionArea');
                    if (statementDefArea) statementDefArea.style.display = 'none';
                    const validityResultDiv = document.getElementById('validityResult');
                    if(validityResultDiv) validityResultDiv.textContent = '';
                });
            }
            
            // Set up subcategory change listener
            const subcategorySelect = document.getElementById('subcategorySelect');
            if (subcategorySelect) {
                subcategorySelect.addEventListener('change', function() {
                    const categorySelect = document.getElementById('categorySelect');
                    const claimSelect = document.getElementById('claimSelect');
                    
                    claimSelect.innerHTML = '<option value="">-- Choose a Claim --</option>';
                    
                    const selectedCategory = categorySelect.value;
                    const selectedSubcategory = this.value;
                    
                    if (selectedCategory && selectedSubcategory && 
                        claimsByCategory[selectedCategory] && 
                        claimsByCategory[selectedCategory][selectedSubcategory]) {
                        
                        claimsByCategory[selectedCategory][selectedSubcategory].forEach(claim => {
                            const option = document.createElement('option');
                            option.value = claim.value;
                            option.textContent = claim.text;
                            claimSelect.appendChild(option);
                        });
                    }
                    
                    populateFilterClaims();
                    
                    // Reset subsequent selections
                    const stanceSelect = document.getElementById('stanceSelect');
                    if(stanceSelect) stanceSelect.value = "";
                    document.getElementById('dynamicArgumentBuilder').style.display = 'none';
                    const statementDefArea = document.getElementById('statementDefinitionArea');
                    if (statementDefArea) statementDefArea.style.display = 'none';
                    const validityResultDiv = document.getElementById('validityResult');
                    if(validityResultDiv) validityResultDiv.textContent = '';
                });
            }
            
            // Set up claim change listener
            const claimSelect = document.getElementById('claimSelect');
            if (claimSelect) {
                claimSelect.addEventListener('change', function() {
                    const stanceSelect = document.getElementById('stanceSelect');
                    if(stanceSelect) stanceSelect.value = ""; 
                    document.getElementById('dynamicArgumentBuilder').style.display = 'none';
                    const statementDefArea = document.getElementById('statementDefinitionArea');
                    if (statementDefArea) statementDefArea.style.display = 'none';
                    const validityResultDiv = document.getElementById('validityResult');
                    if(validityResultDiv) validityResultDiv.textContent = '';
                });
            }
            
            // Set up button
            const setClaimAndBuildButton = document.getElementById('setClaimAndBuildButton');
            if (setClaimAndBuildButton) {
                setClaimAndBuildButton.addEventListener('click', initializeAndShowDynamicBuilder);
            }
            
            // Set up ranking
            const rankingSelect = document.getElementById('rankingSelect');
            if (rankingSelect) {
                rankingSelect.addEventListener('change', displayArguments);
            }
            
            // Initial calls
            populateFilterClaims();
            displayArguments();
        }

        // Auth state listener
        firebase.auth().onAuthStateChanged(function(user) {
            const authContainer = document.getElementById('authContainer');
            const logoutButton = document.getElementById('logoutButton');
            const claimSetupForm = document.getElementById('claimSetupForm');
            const dynamicBuilderSection = document.getElementById('dynamicArgumentBuilder');
            
            if (user) {
                if (authContainer) authContainer.style.display = 'none';
                if (logoutButton) logoutButton.style.display = 'block';
            } else {
                if (authContainer) authContainer.style.display = 'block';
                if (logoutButton) logoutButton.style.display = 'none';
                if(dynamicBuilderSection) dynamicBuilderSection.style.display = 'none';
            }
            
            // Always show claim setup form
            if (claimSetupForm) claimSetupForm.style.display = 'block';
        });

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
        
        console.log("Script 2: Main script completed");
    </script>
</body>
</html>