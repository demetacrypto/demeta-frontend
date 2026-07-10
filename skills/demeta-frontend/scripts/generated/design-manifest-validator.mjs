// Generated from references/design-manifest.schema.json with Ajv 8.20.0. Do not edit by hand.
"use strict";
export const validate = validate20;
export default validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://demeta.dev/schemas/design-manifest-2.0.0.json","title":"DEMETA design manifest","description":"A planning and evidence ledger. Schema validity is not browser, accessibility, performance, ownership, or aesthetic verification.","type":"object","additionalProperties":false,"required":["version","stage","project","thesis","nicheIntelligence","concepts","selectedConcept","selectionRationale","system","architecture","graphics","motion","accessibility","performanceBudget","claims","assets","evidence"],"properties":{"$schema":{"type":"string","minLength":1},"version":{"const":"2.0.0"},"stage":{"enum":["plan","draft","production","verified"]},"project":{"type":"object","additionalProperties":false,"required":["name","niche","audience","singleJob","ambition","locale"],"properties":{"name":{"$ref":"#/$defs/nonEmpty"},"niche":{"$ref":"#/$defs/nonEmpty"},"audience":{"$ref":"#/$defs/nonEmpty"},"singleJob":{"$ref":"#/$defs/nonEmpty"},"ambition":{"enum":["flagship","experimental","campaign"]},"locale":{"$ref":"#/$defs/nonEmpty"}}},"thesis":{"type":"object","additionalProperties":false,"required":["concept","signature","aestheticRisk","restraint"],"properties":{"concept":{"$ref":"#/$defs/nonEmpty"},"signature":{"$ref":"#/$defs/nonEmpty"},"aestheticRisk":{"$ref":"#/$defs/nonEmpty"},"restraint":{"$ref":"#/$defs/nonEmpty"}}},"nicheIntelligence":{"type":"object","additionalProperties":false,"required":["artifacts","rituals","proofSignals","sensoryCues","conversionAction"],"properties":{"artifacts":{"$ref":"#/$defs/threeStrings"},"rituals":{"$ref":"#/$defs/twoStrings"},"proofSignals":{"$ref":"#/$defs/twoStrings"},"sensoryCues":{"$ref":"#/$defs/twoStrings"},"conversionAction":{"$ref":"#/$defs/nonEmpty"}}},"concepts":{"type":"array","minItems":3,"maxItems":5,"items":{"$ref":"#/$defs/concept"}},"selectedConcept":{"$ref":"#/$defs/id"},"selectionRationale":{"$ref":"#/$defs/nonEmpty"},"system":{"type":"object","additionalProperties":false,"required":["colors","typography","geometry","material"],"properties":{"colors":{"type":"array","minItems":4,"maxItems":7,"items":{"type":"object","additionalProperties":false,"required":["name","value","role"],"properties":{"name":{"$ref":"#/$defs/nonEmpty"},"value":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"role":{"$ref":"#/$defs/nonEmpty"}}}},"typography":{"type":"object","additionalProperties":false,"required":["display","body","utility"],"properties":{"display":{"$ref":"#/$defs/nonEmpty"},"body":{"$ref":"#/$defs/nonEmpty"},"utility":{"$ref":"#/$defs/nonEmpty"}}},"geometry":{"$ref":"#/$defs/nonEmpty"},"material":{"$ref":"#/$defs/nonEmpty"}}},"architecture":{"type":"object","additionalProperties":false,"required":["header","heroFrame","sections","scrollDepth","mobileMutation"],"properties":{"header":{"$ref":"#/$defs/nonEmpty"},"heroFrame":{"$ref":"#/$defs/nonEmpty"},"sections":{"$ref":"#/$defs/threeStrings"},"scrollDepth":{"$ref":"#/$defs/nonEmpty"},"mobileMutation":{"$ref":"#/$defs/nonEmpty"}}},"graphics":{"type":"object","additionalProperties":false,"required":["primaryMedium","justification","criticalContentInDom","fallbacks","runtime"],"properties":{"primaryMedium":{"$ref":"#/$defs/nonEmpty"},"justification":{"$ref":"#/$defs/nonEmpty"},"criticalContentInDom":{"type":"boolean"},"fallbacks":{"type":"object","additionalProperties":false,"required":["noWebGL","reducedMotion","lowPower","assetFailure"],"properties":{"noWebGL":{"$ref":"#/$defs/nonEmpty"},"reducedMotion":{"$ref":"#/$defs/nonEmpty"},"lowPower":{"$ref":"#/$defs/nonEmpty"},"assetFailure":{"$ref":"#/$defs/nonEmpty"}}},"runtime":{"type":"object","additionalProperties":false,"required":["lazyLoaded","pauseWhenHidden","pauseControl","disposeOnUnmount","handlesContextLoss"],"properties":{"lazyLoaded":{"type":"boolean"},"pauseWhenHidden":{"type":"boolean"},"pauseControl":{"type":"boolean"},"disposeOnUnmount":{"type":"boolean"},"handlesContextLoss":{"type":"boolean"}}}}},"motion":{"type":"object","additionalProperties":false,"required":["entrance","nicheMoment","reducedMotionStrategy","autoMotionOverFiveSeconds","pauseControl"],"properties":{"entrance":{"$ref":"#/$defs/nonEmpty"},"nicheMoment":{"$ref":"#/$defs/nonEmpty"},"reducedMotionStrategy":{"$ref":"#/$defs/nonEmpty"},"autoMotionOverFiveSeconds":{"type":"boolean"},"pauseControl":{"type":"boolean"}}},"accessibility":{"$ref":"#/$defs/accessibility"},"performanceBudget":{"$ref":"#/$defs/performance"},"claims":{"type":"array","items":{"$ref":"#/$defs/claim"}},"assets":{"type":"array","minItems":1,"items":{"$ref":"#/$defs/asset"}},"evidence":{"$ref":"#/$defs/evidence"}},"allOf":[{"if":{"properties":{"stage":{"enum":["production","verified"]}},"required":["stage"]},"then":{"properties":{"claims":{"type":"array","items":{"allOf":[{"$ref":"#/$defs/claim"},{"type":"object","properties":{"status":{"enum":["verified","user_supplied"]}}}]}},"assets":{"type":"array","items":{"allOf":[{"$ref":"#/$defs/asset"},{"type":"object","required":["sha256"]}]}},"evidence":{"type":"object","$ref":"#/$defs/collectedEvidence"}}}}],"$defs":{"nonEmpty":{"type":"string","minLength":1,"pattern":"\\S"},"id":{"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"},"relativePath":{"type":"string","minLength":1,"pattern":"^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+"},"sha256":{"type":"string","pattern":"^[A-Fa-f0-9]{64}$"},"spdxLicense":{"type":"string","pattern":"^(?:MIT|Apache-2\\.0|BSD-2-Clause|BSD-3-Clause|CC0-1\\.0|CC-BY-4\\.0|CC-BY-SA-4\\.0|ISC|MPL-2\\.0|OFL-1\\.1|Unlicense|LicenseRef-[A-Za-z0-9.-]+)$"},"twoStrings":{"type":"array","minItems":2,"uniqueItems":true,"items":{"$ref":"#/$defs/nonEmpty"}},"threeStrings":{"type":"array","minItems":3,"uniqueItems":true,"items":{"$ref":"#/$defs/nonEmpty"}},"fingerprint":{"type":"object","additionalProperties":false,"required":["heroArchetype","composition","palette","geometry","primaryVisual","motionSignature","typography","sectionRhythm","headerArchitecture","heroFrame","scrollDepthSystem"],"properties":{"heroArchetype":{"$ref":"#/$defs/nonEmpty"},"composition":{"$ref":"#/$defs/nonEmpty"},"palette":{"$ref":"#/$defs/nonEmpty"},"geometry":{"$ref":"#/$defs/nonEmpty"},"primaryVisual":{"$ref":"#/$defs/nonEmpty"},"motionSignature":{"$ref":"#/$defs/nonEmpty"},"typography":{"$ref":"#/$defs/nonEmpty"},"sectionRhythm":{"$ref":"#/$defs/nonEmpty"},"headerArchitecture":{"$ref":"#/$defs/nonEmpty"},"heroFrame":{"$ref":"#/$defs/nonEmpty"},"scrollDepthSystem":{"$ref":"#/$defs/nonEmpty"}}},"concept":{"type":"object","additionalProperties":false,"required":["id","mode","name","signatureInteraction","medium","domainAnchor","conversionHypothesis","tradeoff","rejectionRisk","fingerprint"],"properties":{"id":{"$ref":"#/$defs/id"},"mode":{"enum":["commercially-safe","visually-ambitious","niche-native","counterfactual"]},"name":{"$ref":"#/$defs/nonEmpty"},"signatureInteraction":{"$ref":"#/$defs/nonEmpty"},"medium":{"$ref":"#/$defs/nonEmpty"},"domainAnchor":{"$ref":"#/$defs/nonEmpty"},"conversionHypothesis":{"$ref":"#/$defs/nonEmpty"},"tradeoff":{"$ref":"#/$defs/nonEmpty"},"rejectionRisk":{"$ref":"#/$defs/nonEmpty"},"fingerprint":{"$ref":"#/$defs/fingerprint"}}},"accessibility":{"type":"object","additionalProperties":false,"required":["target","semanticDom","keyboardComplete","visibleFocus","contrastChecked","zoomAndReflowChecked","reducedMotion","canvasAlternative","nonDragAlternative","targetSizeChecked","errorsAnnounced"],"properties":{"target":{"const":"WCAG 2.2 AA"},"semanticDom":{"type":"boolean"},"keyboardComplete":{"type":"boolean"},"visibleFocus":{"type":"boolean"},"contrastChecked":{"type":"boolean"},"zoomAndReflowChecked":{"type":"boolean"},"reducedMotion":{"type":"boolean"},"canvasAlternative":{"type":"boolean"},"nonDragAlternative":{"type":"boolean"},"targetSizeChecked":{"type":"boolean"},"errorsAnnounced":{"type":"boolean"}}},"performance":{"type":"object","additionalProperties":false,"required":["initialJsKbGzip","routeJsKbGzip","mediaMbDesktop","mediaMbMobile","maxDprDesktop","maxDprMobile","maxDrawCalls","maxTriangles","lcpMs","cls","tbtMs"],"properties":{"initialJsKbGzip":{"type":"number","minimum":0,"maximum":250},"routeJsKbGzip":{"type":"number","minimum":0,"maximum":450},"mediaMbDesktop":{"type":"number","minimum":0,"maximum":6},"mediaMbMobile":{"type":"number","minimum":0,"maximum":2},"maxDprDesktop":{"type":"number","minimum":0,"maximum":2},"maxDprMobile":{"type":"number","minimum":0,"maximum":1.5},"maxDrawCalls":{"type":"number","minimum":0,"maximum":120},"maxTriangles":{"type":"number","minimum":0,"maximum":250000},"lcpMs":{"type":"number","minimum":0,"maximum":2500},"cls":{"type":"number","minimum":0,"maximum":0.1},"tbtMs":{"type":"number","minimum":0,"maximum":200}}},"claim":{"type":"object","additionalProperties":false,"required":["id","text","status"],"properties":{"id":{"$ref":"#/$defs/id"},"text":{"$ref":"#/$defs/nonEmpty"},"status":{"enum":["verified","user_supplied","placeholder"]},"source":{"$ref":"#/$defs/nonEmpty"},"sourceType":{"enum":["authoritative-url","first-party-document","first-party-data","user-brief"]},"scope":{"type":"string"},"notes":{"type":"string"}},"allOf":[{"if":{"properties":{"status":{"const":"verified"}},"required":["status"]},"then":{"required":["source","sourceType"]}},{"if":{"properties":{"status":{"const":"user_supplied"}},"required":["status"]},"then":{"required":["source","sourceType"],"properties":{"sourceType":{"const":"user-brief"}}}}]},"asset":{"type":"object","additionalProperties":false,"required":["id","type","source","creator","license","path"],"properties":{"id":{"$ref":"#/$defs/id"},"type":{"$ref":"#/$defs/nonEmpty"},"source":{"enum":["generated","original-code","licensed","owned"]},"creator":{"$ref":"#/$defs/nonEmpty"},"license":{"$ref":"#/$defs/spdxLicense"},"path":{"$ref":"#/$defs/relativePath"},"sha256":{"$ref":"#/$defs/sha256"},"prompt":{"$ref":"#/$defs/nonEmpty"},"generator":{"$ref":"#/$defs/nonEmpty"},"generatedAt":{"type":"string","pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"},"sourceUrl":{"type":"string","pattern":"^https://"},"licenseUrl":{"type":"string","pattern":"^https://"},"attribution":{"$ref":"#/$defs/nonEmpty"},"ownershipNote":{"$ref":"#/$defs/nonEmpty"}},"allOf":[{"if":{"properties":{"source":{"const":"generated"}},"required":["source"]},"then":{"required":["prompt","generator","generatedAt"]}},{"if":{"properties":{"source":{"const":"licensed"}},"required":["source"]},"then":{"required":["sourceUrl","licenseUrl","attribution"]}},{"if":{"properties":{"source":{"const":"owned"}},"required":["source"]},"then":{"required":["ownershipNote"]}}]},"evidenceFile":{"type":"object","additionalProperties":false,"required":["id","kind","path","sha256"],"properties":{"id":{"$ref":"#/$defs/id"},"kind":{"enum":["desktop","mobile","reduced-motion","no-webgl","interaction","build","keyboard","axe","performance","console","manual-review"]},"path":{"$ref":"#/$defs/relativePath"},"sha256":{"$ref":"#/$defs/sha256"},"viewport":{"type":"string","pattern":"^[0-9]+x[0-9]+$"},"notes":{"type":"string"}}},"evidence":{"type":"object","additionalProperties":false,"required":["status","buildCommand","viewports","screenshots","reports","keyboardFlow","webglFallback","reducedMotionRun","consoleErrors","axe"],"properties":{"status":{"enum":["planned","collected"]},"buildCommand":{"$ref":"#/$defs/nonEmpty"},"viewports":{"type":"array","uniqueItems":true,"items":{"type":"string","pattern":"^[0-9]+x[0-9]+$"}},"screenshots":{"type":"array","items":{"$ref":"#/$defs/evidenceFile"}},"reports":{"type":"array","items":{"$ref":"#/$defs/evidenceFile"}},"keyboardFlow":{"type":"boolean"},"webglFallback":{"type":"boolean"},"reducedMotionRun":{"type":"boolean"},"consoleErrors":{"type":"integer","minimum":0},"axe":{"type":"object","additionalProperties":false,"required":["critical","serious"],"properties":{"critical":{"type":"integer","minimum":0},"serious":{"type":"integer","minimum":0}}}}},"collectedEvidence":{"allOf":[{"$ref":"#/$defs/evidence"},{"type":"object","properties":{"status":{"const":"collected"},"viewports":{"type":"array","minItems":2,"allOf":[{"contains":{"type":"string","pattern":"^(?:1[2-9][0-9]{2}|[2-9][0-9]{3,})x"},"minContains":1},{"contains":{"type":"string","pattern":"^(?:320|360|375|390|412|430)x"},"minContains":1}]},"screenshots":{"type":"array","minItems":4,"allOf":[{"contains":{"type":"object","properties":{"kind":{"const":"desktop"}},"required":["kind"]},"minContains":1},{"contains":{"type":"object","properties":{"kind":{"const":"mobile"}},"required":["kind"]},"minContains":1},{"contains":{"type":"object","properties":{"kind":{"const":"reduced-motion"}},"required":["kind"]},"minContains":1},{"contains":{"type":"object","properties":{"kind":{"const":"no-webgl"}},"required":["kind"]},"minContains":1}]},"reports":{"type":"array","minItems":3},"keyboardFlow":{"const":true},"webglFallback":{"const":true},"reducedMotionRun":{"const":true},"consoleErrors":{"const":0},"axe":{"type":"object","properties":{"critical":{"const":0},"serious":{"const":0}}}}}]}}};
const schema34 = {"type":"string","minLength":1,"pattern":"\\S"};
const schema33 = {"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$"};
const schema111 = {"type":"object","additionalProperties":false,"required":["target","semanticDom","keyboardComplete","visibleFocus","contrastChecked","zoomAndReflowChecked","reducedMotion","canvasAlternative","nonDragAlternative","targetSizeChecked","errorsAnnounced"],"properties":{"target":{"const":"WCAG 2.2 AA"},"semanticDom":{"type":"boolean"},"keyboardComplete":{"type":"boolean"},"visibleFocus":{"type":"boolean"},"contrastChecked":{"type":"boolean"},"zoomAndReflowChecked":{"type":"boolean"},"reducedMotion":{"type":"boolean"},"canvasAlternative":{"type":"boolean"},"nonDragAlternative":{"type":"boolean"},"targetSizeChecked":{"type":"boolean"},"errorsAnnounced":{"type":"boolean"}}};
const schema112 = {"type":"object","additionalProperties":false,"required":["initialJsKbGzip","routeJsKbGzip","mediaMbDesktop","mediaMbMobile","maxDprDesktop","maxDprMobile","maxDrawCalls","maxTriangles","lcpMs","cls","tbtMs"],"properties":{"initialJsKbGzip":{"type":"number","minimum":0,"maximum":250},"routeJsKbGzip":{"type":"number","minimum":0,"maximum":450},"mediaMbDesktop":{"type":"number","minimum":0,"maximum":6},"mediaMbMobile":{"type":"number","minimum":0,"maximum":2},"maxDprDesktop":{"type":"number","minimum":0,"maximum":2},"maxDprMobile":{"type":"number","minimum":0,"maximum":1.5},"maxDrawCalls":{"type":"number","minimum":0,"maximum":120},"maxTriangles":{"type":"number","minimum":0,"maximum":250000},"lcpMs":{"type":"number","minimum":0,"maximum":2500},"cls":{"type":"number","minimum":0,"maximum":0.1},"tbtMs":{"type":"number","minimum":0,"maximum":200}}};
const schema32 = {"type":"object","additionalProperties":false,"required":["id","text","status"],"properties":{"id":{"$ref":"#/$defs/id"},"text":{"$ref":"#/$defs/nonEmpty"},"status":{"enum":["verified","user_supplied","placeholder"]},"source":{"$ref":"#/$defs/nonEmpty"},"sourceType":{"enum":["authoritative-url","first-party-document","first-party-data","user-brief"]},"scope":{"type":"string"},"notes":{"type":"string"}},"allOf":[{"if":{"properties":{"status":{"const":"verified"}},"required":["status"]},"then":{"required":["source","sourceType"]}},{"if":{"properties":{"status":{"const":"user_supplied"}},"required":["status"]},"then":{"required":["source","sourceType"],"properties":{"sourceType":{"const":"user-brief"}}}}]};
const pattern4 = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$", "u");
const pattern5 = new RegExp("\\S", "u");
function func1(str) {
  const len = str.length;
  let length = 0;
  let pos = 0;
  while (pos < len) {
    length += 1;
    let value = str.charCodeAt(pos++);
    if (value >= 0xd800 && value <= 0xdbff && pos < len) {
      value = str.charCodeAt(pos);
      if ((value & 0xfc00) === 0xdc00) pos += 1;
    }
  }
  return length;
}

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.status === undefined) && (missing0 = "status")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.status !== undefined){
if("verified" !== data.status){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.source === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.sourceType === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "sourceType"},message:"must have required property '"+"sourceType"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
}
if(!valid1){
const err4 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
const _errs7 = errors;
let valid3 = true;
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.status === undefined) && (missing1 = "status")){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
if(data.status !== undefined){
if("user_supplied" !== data.status){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
}
var _valid1 = _errs8 === errors;
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs10 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.source === undefined){
const err7 = {instancePath,schemaPath:"#/allOf/1/then/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.sourceType === undefined){
const err8 = {instancePath,schemaPath:"#/allOf/1/then/required",keyword:"required",params:{missingProperty: "sourceType"},message:"must have required property '"+"sourceType"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.sourceType !== undefined){
if("user-brief" !== data.sourceType){
const err9 = {instancePath:instancePath+"/sourceType",schemaPath:"#/allOf/1/then/properties/sourceType/const",keyword:"const",params:{allowedValue: "user-brief"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
var _valid1 = _errs10 === errors;
valid3 = _valid1;
if(valid3){
var props0 = {};
props0.sourceType = true;
props0.status = true;
}
}
if(!valid3){
const err10 = {instancePath,schemaPath:"#/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.status = true;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.text === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.status === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "id") || (key0 === "text")) || (key0 === "status")) || (key0 === "source")) || (key0 === "sourceType")) || (key0 === "scope")) || (key0 === "notes"))){
const err14 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.id !== undefined){
let data3 = data.id;
if(typeof data3 === "string"){
if(!pattern4.test(data3)){
const err15 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.text !== undefined){
let data4 = data.text;
if(typeof data4 === "string"){
if(func1(data4) < 1){
const err17 = {instancePath:instancePath+"/text",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(!pattern5.test(data4)){
const err18 = {instancePath:instancePath+"/text",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/text",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.status !== undefined){
let data5 = data.status;
if(!(((data5 === "verified") || (data5 === "user_supplied")) || (data5 === "placeholder"))){
const err20 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema32.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.source !== undefined){
let data6 = data.source;
if(typeof data6 === "string"){
if(func1(data6) < 1){
const err21 = {instancePath:instancePath+"/source",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(!pattern5.test(data6)){
const err22 = {instancePath:instancePath+"/source",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/source",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.sourceType !== undefined){
let data7 = data.sourceType;
if(!((((data7 === "authoritative-url") || (data7 === "first-party-document")) || (data7 === "first-party-data")) || (data7 === "user-brief"))){
const err24 = {instancePath:instancePath+"/sourceType",schemaPath:"#/properties/sourceType/enum",keyword:"enum",params:{allowedValues: schema32.properties.sourceType.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.scope !== undefined){
if(typeof data.scope !== "string"){
const err25 = {instancePath:instancePath+"/scope",schemaPath:"#/properties/scope/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.notes !== undefined){
if(typeof data.notes !== "string"){
const err26 = {instancePath:instancePath+"/notes",schemaPath:"#/properties/notes/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
else {
const err27 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
validate21.errors = vErrors;
return errors === 0;
}
validate21.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema36 = {"type":"object","additionalProperties":false,"required":["id","type","source","creator","license","path"],"properties":{"id":{"$ref":"#/$defs/id"},"type":{"$ref":"#/$defs/nonEmpty"},"source":{"enum":["generated","original-code","licensed","owned"]},"creator":{"$ref":"#/$defs/nonEmpty"},"license":{"$ref":"#/$defs/spdxLicense"},"path":{"$ref":"#/$defs/relativePath"},"sha256":{"$ref":"#/$defs/sha256"},"prompt":{"$ref":"#/$defs/nonEmpty"},"generator":{"$ref":"#/$defs/nonEmpty"},"generatedAt":{"type":"string","pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"},"sourceUrl":{"type":"string","pattern":"^https://"},"licenseUrl":{"type":"string","pattern":"^https://"},"attribution":{"$ref":"#/$defs/nonEmpty"},"ownershipNote":{"$ref":"#/$defs/nonEmpty"}},"allOf":[{"if":{"properties":{"source":{"const":"generated"}},"required":["source"]},"then":{"required":["prompt","generator","generatedAt"]}},{"if":{"properties":{"source":{"const":"licensed"}},"required":["source"]},"then":{"required":["sourceUrl","licenseUrl","attribution"]}},{"if":{"properties":{"source":{"const":"owned"}},"required":["source"]},"then":{"required":["ownershipNote"]}}]};
const schema40 = {"type":"string","pattern":"^(?:MIT|Apache-2\\.0|BSD-2-Clause|BSD-3-Clause|CC0-1\\.0|CC-BY-4\\.0|CC-BY-SA-4\\.0|ISC|MPL-2\\.0|OFL-1\\.1|Unlicense|LicenseRef-[A-Za-z0-9.-]+)$"};
const schema41 = {"type":"string","minLength":1,"pattern":"^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+"};
const schema42 = {"type":"string","pattern":"^[A-Fa-f0-9]{64}$"};
const func3 = Object.prototype.hasOwnProperty;
const pattern10 = new RegExp("^(?:MIT|Apache-2\\.0|BSD-2-Clause|BSD-3-Clause|CC0-1\\.0|CC-BY-4\\.0|CC-BY-SA-4\\.0|ISC|MPL-2\\.0|OFL-1\\.1|Unlicense|LicenseRef-[A-Za-z0-9.-]+)$", "u");
const pattern11 = new RegExp("^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+", "u");
const pattern12 = new RegExp("^[A-Fa-f0-9]{64}$", "u");
const pattern15 = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$", "u");
const pattern16 = new RegExp("^https://", "u");

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.source === undefined) && (missing0 = "source")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.source !== undefined){
if("generated" !== data.source){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.prompt === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "prompt"},message:"must have required property '"+"prompt"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.generator === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "generator"},message:"must have required property '"+"generator"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.generatedAt === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "generatedAt"},message:"must have required property '"+"generatedAt"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
}
if(!valid1){
const err5 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
const _errs7 = errors;
let valid3 = true;
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.source === undefined) && (missing1 = "source")){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
if(data.source !== undefined){
if("licensed" !== data.source){
const err7 = {};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
}
var _valid1 = _errs8 === errors;
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs10 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.sourceUrl === undefined){
const err8 = {instancePath,schemaPath:"#/allOf/1/then/required",keyword:"required",params:{missingProperty: "sourceUrl"},message:"must have required property '"+"sourceUrl"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.licenseUrl === undefined){
const err9 = {instancePath,schemaPath:"#/allOf/1/then/required",keyword:"required",params:{missingProperty: "licenseUrl"},message:"must have required property '"+"licenseUrl"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.attribution === undefined){
const err10 = {instancePath,schemaPath:"#/allOf/1/then/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
var _valid1 = _errs10 === errors;
valid3 = _valid1;
}
if(!valid3){
const err11 = {instancePath,schemaPath:"#/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
const _errs12 = errors;
let valid5 = true;
const _errs13 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if((data.source === undefined) && (missing2 = "source")){
const err12 = {};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
else {
if(data.source !== undefined){
if("owned" !== data.source){
const err13 = {};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
}
var _valid2 = _errs13 === errors;
errors = _errs12;
if(vErrors !== null){
if(_errs12){
vErrors.length = _errs12;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs15 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.ownershipNote === undefined){
const err14 = {instancePath,schemaPath:"#/allOf/2/then/required",keyword:"required",params:{missingProperty: "ownershipNote"},message:"must have required property '"+"ownershipNote"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
var _valid2 = _errs15 === errors;
valid5 = _valid2;
}
if(!valid5){
const err15 = {instancePath,schemaPath:"#/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.type === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.source === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data.creator === undefined){
const err19 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "creator"},message:"must have required property '"+"creator"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data.license === undefined){
const err20 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data.path === undefined){
const err21 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
for(const key0 in data){
if(!(func3.call(schema36.properties, key0))){
const err22 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.id !== undefined){
let data3 = data.id;
if(typeof data3 === "string"){
if(!pattern4.test(data3)){
const err23 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.type !== undefined){
let data4 = data.type;
if(typeof data4 === "string"){
if(func1(data4) < 1){
const err25 = {instancePath:instancePath+"/type",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(!pattern5.test(data4)){
const err26 = {instancePath:instancePath+"/type",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
else {
const err27 = {instancePath:instancePath+"/type",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.source !== undefined){
let data5 = data.source;
if(!((((data5 === "generated") || (data5 === "original-code")) || (data5 === "licensed")) || (data5 === "owned"))){
const err28 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/enum",keyword:"enum",params:{allowedValues: schema36.properties.source.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.creator !== undefined){
let data6 = data.creator;
if(typeof data6 === "string"){
if(func1(data6) < 1){
const err29 = {instancePath:instancePath+"/creator",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(!pattern5.test(data6)){
const err30 = {instancePath:instancePath+"/creator",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/creator",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.license !== undefined){
let data7 = data.license;
if(typeof data7 === "string"){
if(!pattern10.test(data7)){
const err32 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/spdxLicense/pattern",keyword:"pattern",params:{pattern: "^(?:MIT|Apache-2\\.0|BSD-2-Clause|BSD-3-Clause|CC0-1\\.0|CC-BY-4\\.0|CC-BY-SA-4\\.0|ISC|MPL-2\\.0|OFL-1\\.1|Unlicense|LicenseRef-[A-Za-z0-9.-]+)$"},message:"must match pattern \""+"^(?:MIT|Apache-2\\.0|BSD-2-Clause|BSD-3-Clause|CC0-1\\.0|CC-BY-4\\.0|CC-BY-SA-4\\.0|ISC|MPL-2\\.0|OFL-1\\.1|Unlicense|LicenseRef-[A-Za-z0-9.-]+)$"+"\""};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/spdxLicense/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.path !== undefined){
let data8 = data.path;
if(typeof data8 === "string"){
if(func1(data8) < 1){
const err34 = {instancePath:instancePath+"/path",schemaPath:"#/$defs/relativePath/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(!pattern11.test(data8)){
const err35 = {instancePath:instancePath+"/path",schemaPath:"#/$defs/relativePath/pattern",keyword:"pattern",params:{pattern: "^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+"},message:"must match pattern \""+"^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+"+"\""};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
else {
const err36 = {instancePath:instancePath+"/path",schemaPath:"#/$defs/relativePath/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.sha256 !== undefined){
let data9 = data.sha256;
if(typeof data9 === "string"){
if(!pattern12.test(data9)){
const err37 = {instancePath:instancePath+"/sha256",schemaPath:"#/$defs/sha256/pattern",keyword:"pattern",params:{pattern: "^[A-Fa-f0-9]{64}$"},message:"must match pattern \""+"^[A-Fa-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
else {
const err38 = {instancePath:instancePath+"/sha256",schemaPath:"#/$defs/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.prompt !== undefined){
let data10 = data.prompt;
if(typeof data10 === "string"){
if(func1(data10) < 1){
const err39 = {instancePath:instancePath+"/prompt",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(!pattern5.test(data10)){
const err40 = {instancePath:instancePath+"/prompt",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/prompt",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.generator !== undefined){
let data11 = data.generator;
if(typeof data11 === "string"){
if(func1(data11) < 1){
const err42 = {instancePath:instancePath+"/generator",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(!pattern5.test(data11)){
const err43 = {instancePath:instancePath+"/generator",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/generator",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data.generatedAt !== undefined){
let data12 = data.generatedAt;
if(typeof data12 === "string"){
if(!pattern15.test(data12)){
const err45 = {instancePath:instancePath+"/generatedAt",schemaPath:"#/properties/generatedAt/pattern",keyword:"pattern",params:{pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"},message:"must match pattern \""+"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/generatedAt",schemaPath:"#/properties/generatedAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data.sourceUrl !== undefined){
let data13 = data.sourceUrl;
if(typeof data13 === "string"){
if(!pattern16.test(data13)){
const err47 = {instancePath:instancePath+"/sourceUrl",schemaPath:"#/properties/sourceUrl/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/sourceUrl",schemaPath:"#/properties/sourceUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data.licenseUrl !== undefined){
let data14 = data.licenseUrl;
if(typeof data14 === "string"){
if(!pattern16.test(data14)){
const err49 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.attribution !== undefined){
let data15 = data.attribution;
if(typeof data15 === "string"){
if(func1(data15) < 1){
const err51 = {instancePath:instancePath+"/attribution",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(!pattern5.test(data15)){
const err52 = {instancePath:instancePath+"/attribution",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/attribution",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.ownershipNote !== undefined){
let data16 = data.ownershipNote;
if(typeof data16 === "string"){
if(func1(data16) < 1){
const err54 = {instancePath:instancePath+"/ownershipNote",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
if(!pattern5.test(data16)){
const err55 = {instancePath:instancePath+"/ownershipNote",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
else {
const err56 = {instancePath:instancePath+"/ownershipNote",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
}
else {
const err57 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema47 = {"allOf":[{"$ref":"#/$defs/evidence"},{"type":"object","properties":{"status":{"const":"collected"},"viewports":{"type":"array","minItems":2,"allOf":[{"contains":{"type":"string","pattern":"^(?:1[2-9][0-9]{2}|[2-9][0-9]{3,})x"},"minContains":1},{"contains":{"type":"string","pattern":"^(?:320|360|375|390|412|430)x"},"minContains":1}]},"screenshots":{"type":"array","minItems":4,"allOf":[{"contains":{"type":"object","properties":{"kind":{"const":"desktop"}},"required":["kind"]},"minContains":1},{"contains":{"type":"object","properties":{"kind":{"const":"mobile"}},"required":["kind"]},"minContains":1},{"contains":{"type":"object","properties":{"kind":{"const":"reduced-motion"}},"required":["kind"]},"minContains":1},{"contains":{"type":"object","properties":{"kind":{"const":"no-webgl"}},"required":["kind"]},"minContains":1}]},"reports":{"type":"array","minItems":3},"keyboardFlow":{"const":true},"webglFallback":{"const":true},"reducedMotionRun":{"const":true},"consoleErrors":{"const":0},"axe":{"type":"object","properties":{"critical":{"const":0},"serious":{"const":0}}}}}]};
const schema48 = {"type":"object","additionalProperties":false,"required":["status","buildCommand","viewports","screenshots","reports","keyboardFlow","webglFallback","reducedMotionRun","consoleErrors","axe"],"properties":{"status":{"enum":["planned","collected"]},"buildCommand":{"$ref":"#/$defs/nonEmpty"},"viewports":{"type":"array","uniqueItems":true,"items":{"type":"string","pattern":"^[0-9]+x[0-9]+$"}},"screenshots":{"type":"array","items":{"$ref":"#/$defs/evidenceFile"}},"reports":{"type":"array","items":{"$ref":"#/$defs/evidenceFile"}},"keyboardFlow":{"type":"boolean"},"webglFallback":{"type":"boolean"},"reducedMotionRun":{"type":"boolean"},"consoleErrors":{"type":"integer","minimum":0},"axe":{"type":"object","additionalProperties":false,"required":["critical","serious"],"properties":{"critical":{"type":"integer","minimum":0},"serious":{"type":"integer","minimum":0}}}}};
const pattern21 = new RegExp("^[0-9]+x[0-9]+$", "u");
const schema50 = {"type":"object","additionalProperties":false,"required":["id","kind","path","sha256"],"properties":{"id":{"$ref":"#/$defs/id"},"kind":{"enum":["desktop","mobile","reduced-motion","no-webgl","interaction","build","keyboard","axe","performance","console","manual-review"]},"path":{"$ref":"#/$defs/relativePath"},"sha256":{"$ref":"#/$defs/sha256"},"viewport":{"type":"string","pattern":"^[0-9]+x[0-9]+$"},"notes":{"type":"string"}}};

function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate27.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.kind === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.path === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.sha256 === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "id") || (key0 === "kind")) || (key0 === "path")) || (key0 === "sha256")) || (key0 === "viewport")) || (key0 === "notes"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err5 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.kind !== undefined){
let data1 = data.kind;
if(!(((((((((((data1 === "desktop") || (data1 === "mobile")) || (data1 === "reduced-motion")) || (data1 === "no-webgl")) || (data1 === "interaction")) || (data1 === "build")) || (data1 === "keyboard")) || (data1 === "axe")) || (data1 === "performance")) || (data1 === "console")) || (data1 === "manual-review"))){
const err7 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/enum",keyword:"enum",params:{allowedValues: schema50.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.path !== undefined){
let data2 = data.path;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err8 = {instancePath:instancePath+"/path",schemaPath:"#/$defs/relativePath/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(!pattern11.test(data2)){
const err9 = {instancePath:instancePath+"/path",schemaPath:"#/$defs/relativePath/pattern",keyword:"pattern",params:{pattern: "^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+"},message:"must match pattern \""+"^(?!/)(?![A-Za-z]:[\\\\/])(?!.*(?:^|/)\\.\\.(?:/|$)).+"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/path",schemaPath:"#/$defs/relativePath/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.sha256 !== undefined){
let data3 = data.sha256;
if(typeof data3 === "string"){
if(!pattern12.test(data3)){
const err11 = {instancePath:instancePath+"/sha256",schemaPath:"#/$defs/sha256/pattern",keyword:"pattern",params:{pattern: "^[A-Fa-f0-9]{64}$"},message:"must match pattern \""+"^[A-Fa-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/sha256",schemaPath:"#/$defs/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.viewport !== undefined){
let data4 = data.viewport;
if(typeof data4 === "string"){
if(!pattern21.test(data4)){
const err13 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/pattern",keyword:"pattern",params:{pattern: "^[0-9]+x[0-9]+$"},message:"must match pattern \""+"^[0-9]+x[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/viewport",schemaPath:"#/properties/viewport/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.notes !== undefined){
if(typeof data.notes !== "string"){
const err15 = {instancePath:instancePath+"/notes",schemaPath:"#/properties/notes/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate27.errors = vErrors;
return errors === 0;
}
validate27.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate26.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.status === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.buildCommand === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "buildCommand"},message:"must have required property '"+"buildCommand"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.viewports === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "viewports"},message:"must have required property '"+"viewports"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.screenshots === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "screenshots"},message:"must have required property '"+"screenshots"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.reports === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "reports"},message:"must have required property '"+"reports"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.keyboardFlow === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "keyboardFlow"},message:"must have required property '"+"keyboardFlow"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.webglFallback === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "webglFallback"},message:"must have required property '"+"webglFallback"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.reducedMotionRun === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "reducedMotionRun"},message:"must have required property '"+"reducedMotionRun"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.consoleErrors === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "consoleErrors"},message:"must have required property '"+"consoleErrors"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.axe === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "axe"},message:"must have required property '"+"axe"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key0 in data){
if(!(func3.call(schema48.properties, key0))){
const err10 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.status !== undefined){
let data0 = data.status;
if(!((data0 === "planned") || (data0 === "collected"))){
const err11 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema48.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.buildCommand !== undefined){
let data1 = data.buildCommand;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err12 = {instancePath:instancePath+"/buildCommand",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(!pattern5.test(data1)){
const err13 = {instancePath:instancePath+"/buildCommand",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/buildCommand",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.viewports !== undefined){
let data2 = data.viewports;
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(!pattern21.test(data3)){
const err15 = {instancePath:instancePath+"/viewports/" + i0,schemaPath:"#/properties/viewports/items/pattern",keyword:"pattern",params:{pattern: "^[0-9]+x[0-9]+$"},message:"must match pattern \""+"^[0-9]+x[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/viewports/" + i0,schemaPath:"#/properties/viewports/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
let i1 = data2.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data2[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err17 = {instancePath:instancePath+"/viewports",schemaPath:"#/properties/viewports/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
break;
}
indices0[item0] = i1;
}
}
}
else {
const err18 = {instancePath:instancePath+"/viewports",schemaPath:"#/properties/viewports/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.screenshots !== undefined){
let data4 = data.screenshots;
if(Array.isArray(data4)){
const len1 = data4.length;
for(let i2=0; i2<len1; i2++){
if(!(validate27(data4[i2], {instancePath:instancePath+"/screenshots/" + i2,parentData:data4,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
errors = vErrors.length;
}
}
}
else {
const err19 = {instancePath:instancePath+"/screenshots",schemaPath:"#/properties/screenshots/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.reports !== undefined){
let data6 = data.reports;
if(Array.isArray(data6)){
const len2 = data6.length;
for(let i3=0; i3<len2; i3++){
if(!(validate27(data6[i3], {instancePath:instancePath+"/reports/" + i3,parentData:data6,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
errors = vErrors.length;
}
}
}
else {
const err20 = {instancePath:instancePath+"/reports",schemaPath:"#/properties/reports/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.keyboardFlow !== undefined){
if(typeof data.keyboardFlow !== "boolean"){
const err21 = {instancePath:instancePath+"/keyboardFlow",schemaPath:"#/properties/keyboardFlow/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.webglFallback !== undefined){
if(typeof data.webglFallback !== "boolean"){
const err22 = {instancePath:instancePath+"/webglFallback",schemaPath:"#/properties/webglFallback/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.reducedMotionRun !== undefined){
if(typeof data.reducedMotionRun !== "boolean"){
const err23 = {instancePath:instancePath+"/reducedMotionRun",schemaPath:"#/properties/reducedMotionRun/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.consoleErrors !== undefined){
let data11 = data.consoleErrors;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err24 = {instancePath:instancePath+"/consoleErrors",schemaPath:"#/properties/consoleErrors/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 < 0 || isNaN(data11)){
const err25 = {instancePath:instancePath+"/consoleErrors",schemaPath:"#/properties/consoleErrors/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
}
if(data.axe !== undefined){
let data12 = data.axe;
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(data12.critical === undefined){
const err26 = {instancePath:instancePath+"/axe",schemaPath:"#/properties/axe/required",keyword:"required",params:{missingProperty: "critical"},message:"must have required property '"+"critical"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data12.serious === undefined){
const err27 = {instancePath:instancePath+"/axe",schemaPath:"#/properties/axe/required",keyword:"required",params:{missingProperty: "serious"},message:"must have required property '"+"serious"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
for(const key1 in data12){
if(!((key1 === "critical") || (key1 === "serious"))){
const err28 = {instancePath:instancePath+"/axe",schemaPath:"#/properties/axe/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data12.critical !== undefined){
let data13 = data12.critical;
if(!(((typeof data13 == "number") && (!(data13 % 1) && !isNaN(data13))) && (isFinite(data13)))){
const err29 = {instancePath:instancePath+"/axe/critical",schemaPath:"#/properties/axe/properties/critical/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 < 0 || isNaN(data13)){
const err30 = {instancePath:instancePath+"/axe/critical",schemaPath:"#/properties/axe/properties/critical/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
if(data12.serious !== undefined){
let data14 = data12.serious;
if(!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))){
const err31 = {instancePath:instancePath+"/axe/serious",schemaPath:"#/properties/axe/properties/serious/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 < 0 || isNaN(data14)){
const err32 = {instancePath:instancePath+"/axe/serious",schemaPath:"#/properties/axe/properties/serious/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
}
else {
const err33 = {instancePath:instancePath+"/axe",schemaPath:"#/properties/axe/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
}
else {
const err34 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
validate26.errors = vErrors;
return errors === 0;
}
validate26.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const pattern26 = new RegExp("^(?:1[2-9][0-9]{2}|[2-9][0-9]{3,})x", "u");
const pattern27 = new RegExp("^(?:320|360|375|390|412|430)x", "u");

function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.status !== undefined){
if("collected" !== data.status){
const err0 = {instancePath:instancePath+"/status",schemaPath:"#/allOf/1/properties/status/const",keyword:"const",params:{allowedValue: "collected"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
if(data.viewports !== undefined){
let data1 = data.viewports;
if(Array.isArray(data1)){
const _errs7 = errors;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
const _errs8 = errors;
if(typeof data2 === "string"){
if(!pattern26.test(data2)){
const err1 = {instancePath:instancePath+"/viewports/" + i0,schemaPath:"#/allOf/1/properties/viewports/allOf/0/contains/pattern",keyword:"pattern",params:{pattern: "^(?:1[2-9][0-9]{2}|[2-9][0-9]{3,})x"},message:"must match pattern \""+"^(?:1[2-9][0-9]{2}|[2-9][0-9]{3,})x"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath:instancePath+"/viewports/" + i0,schemaPath:"#/allOf/1/properties/viewports/allOf/0/contains/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var valid3 = _errs8 === errors;
if(valid3){
break;
}
}
if(!valid3){
const err3 = {instancePath:instancePath+"/viewports",schemaPath:"#/allOf/1/properties/viewports/allOf/0/contains",keyword:"contains",params:{minContains: 1},message:"must contain at least 1 valid item(s)"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
}
if(Array.isArray(data1)){
const _errs11 = errors;
const len1 = data1.length;
for(let i1=0; i1<len1; i1++){
let data3 = data1[i1];
const _errs12 = errors;
if(typeof data3 === "string"){
if(!pattern27.test(data3)){
const err4 = {instancePath:instancePath+"/viewports/" + i1,schemaPath:"#/allOf/1/properties/viewports/allOf/1/contains/pattern",keyword:"pattern",params:{pattern: "^(?:320|360|375|390|412|430)x"},message:"must match pattern \""+"^(?:320|360|375|390|412|430)x"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/viewports/" + i1,schemaPath:"#/allOf/1/properties/viewports/allOf/1/contains/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var valid4 = _errs12 === errors;
if(valid4){
break;
}
}
if(!valid4){
const err6 = {instancePath:instancePath+"/viewports",schemaPath:"#/allOf/1/properties/viewports/allOf/1/contains",keyword:"contains",params:{minContains: 1},message:"must contain at least 1 valid item(s)"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
}
if(Array.isArray(data1)){
if(data1.length < 2){
const err7 = {instancePath:instancePath+"/viewports",schemaPath:"#/allOf/1/properties/viewports/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/viewports",schemaPath:"#/allOf/1/properties/viewports/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.screenshots !== undefined){
let data4 = data.screenshots;
if(Array.isArray(data4)){
const _errs17 = errors;
const len2 = data4.length;
for(let i2=0; i2<len2; i2++){
let data5 = data4[i2];
const _errs18 = errors;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.kind === undefined){
const err9 = {instancePath:instancePath+"/screenshots/" + i2,schemaPath:"#/allOf/1/properties/screenshots/allOf/0/contains/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data5.kind !== undefined){
if("desktop" !== data5.kind){
const err10 = {instancePath:instancePath+"/screenshots/" + i2+"/kind",schemaPath:"#/allOf/1/properties/screenshots/allOf/0/contains/properties/kind/const",keyword:"const",params:{allowedValue: "desktop"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath:instancePath+"/screenshots/" + i2,schemaPath:"#/allOf/1/properties/screenshots/allOf/0/contains/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var valid6 = _errs18 === errors;
if(valid6){
break;
}
}
if(!valid6){
const err12 = {instancePath:instancePath+"/screenshots",schemaPath:"#/allOf/1/properties/screenshots/allOf/0/contains",keyword:"contains",params:{minContains: 1},message:"must contain at least 1 valid item(s)"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
}
if(Array.isArray(data4)){
const _errs22 = errors;
const len3 = data4.length;
for(let i3=0; i3<len3; i3++){
let data7 = data4[i3];
const _errs23 = errors;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.kind === undefined){
const err13 = {instancePath:instancePath+"/screenshots/" + i3,schemaPath:"#/allOf/1/properties/screenshots/allOf/1/contains/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data7.kind !== undefined){
if("mobile" !== data7.kind){
const err14 = {instancePath:instancePath+"/screenshots/" + i3+"/kind",schemaPath:"#/allOf/1/properties/screenshots/allOf/1/contains/properties/kind/const",keyword:"const",params:{allowedValue: "mobile"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath:instancePath+"/screenshots/" + i3,schemaPath:"#/allOf/1/properties/screenshots/allOf/1/contains/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
var valid8 = _errs23 === errors;
if(valid8){
break;
}
}
if(!valid8){
const err16 = {instancePath:instancePath+"/screenshots",schemaPath:"#/allOf/1/properties/screenshots/allOf/1/contains",keyword:"contains",params:{minContains: 1},message:"must contain at least 1 valid item(s)"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
else {
errors = _errs22;
if(vErrors !== null){
if(_errs22){
vErrors.length = _errs22;
}
else {
vErrors = null;
}
}
}
}
if(Array.isArray(data4)){
const _errs27 = errors;
const len4 = data4.length;
for(let i4=0; i4<len4; i4++){
let data9 = data4[i4];
const _errs28 = errors;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(data9.kind === undefined){
const err17 = {instancePath:instancePath+"/screenshots/" + i4,schemaPath:"#/allOf/1/properties/screenshots/allOf/2/contains/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data9.kind !== undefined){
if("reduced-motion" !== data9.kind){
const err18 = {instancePath:instancePath+"/screenshots/" + i4+"/kind",schemaPath:"#/allOf/1/properties/screenshots/allOf/2/contains/properties/kind/const",keyword:"const",params:{allowedValue: "reduced-motion"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/screenshots/" + i4,schemaPath:"#/allOf/1/properties/screenshots/allOf/2/contains/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
var valid10 = _errs28 === errors;
if(valid10){
break;
}
}
if(!valid10){
const err20 = {instancePath:instancePath+"/screenshots",schemaPath:"#/allOf/1/properties/screenshots/allOf/2/contains",keyword:"contains",params:{minContains: 1},message:"must contain at least 1 valid item(s)"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
else {
errors = _errs27;
if(vErrors !== null){
if(_errs27){
vErrors.length = _errs27;
}
else {
vErrors = null;
}
}
}
}
if(Array.isArray(data4)){
const _errs32 = errors;
const len5 = data4.length;
for(let i5=0; i5<len5; i5++){
let data11 = data4[i5];
const _errs33 = errors;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.kind === undefined){
const err21 = {instancePath:instancePath+"/screenshots/" + i5,schemaPath:"#/allOf/1/properties/screenshots/allOf/3/contains/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data11.kind !== undefined){
if("no-webgl" !== data11.kind){
const err22 = {instancePath:instancePath+"/screenshots/" + i5+"/kind",schemaPath:"#/allOf/1/properties/screenshots/allOf/3/contains/properties/kind/const",keyword:"const",params:{allowedValue: "no-webgl"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/screenshots/" + i5,schemaPath:"#/allOf/1/properties/screenshots/allOf/3/contains/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
var valid12 = _errs33 === errors;
if(valid12){
break;
}
}
if(!valid12){
const err24 = {instancePath:instancePath+"/screenshots",schemaPath:"#/allOf/1/properties/screenshots/allOf/3/contains",keyword:"contains",params:{minContains: 1},message:"must contain at least 1 valid item(s)"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
else {
errors = _errs32;
if(vErrors !== null){
if(_errs32){
vErrors.length = _errs32;
}
else {
vErrors = null;
}
}
}
}
if(Array.isArray(data4)){
if(data4.length < 4){
const err25 = {instancePath:instancePath+"/screenshots",schemaPath:"#/allOf/1/properties/screenshots/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/screenshots",schemaPath:"#/allOf/1/properties/screenshots/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.reports !== undefined){
let data13 = data.reports;
if(Array.isArray(data13)){
if(data13.length < 3){
const err27 = {instancePath:instancePath+"/reports",schemaPath:"#/allOf/1/properties/reports/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
else {
const err28 = {instancePath:instancePath+"/reports",schemaPath:"#/allOf/1/properties/reports/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.keyboardFlow !== undefined){
if(true !== data.keyboardFlow){
const err29 = {instancePath:instancePath+"/keyboardFlow",schemaPath:"#/allOf/1/properties/keyboardFlow/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.webglFallback !== undefined){
if(true !== data.webglFallback){
const err30 = {instancePath:instancePath+"/webglFallback",schemaPath:"#/allOf/1/properties/webglFallback/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data.reducedMotionRun !== undefined){
if(true !== data.reducedMotionRun){
const err31 = {instancePath:instancePath+"/reducedMotionRun",schemaPath:"#/allOf/1/properties/reducedMotionRun/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.consoleErrors !== undefined){
if(0 !== data.consoleErrors){
const err32 = {instancePath:instancePath+"/consoleErrors",schemaPath:"#/allOf/1/properties/consoleErrors/const",keyword:"const",params:{allowedValue: 0},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.axe !== undefined){
let data18 = data.axe;
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
if(data18.critical !== undefined){
if(0 !== data18.critical){
const err33 = {instancePath:instancePath+"/axe/critical",schemaPath:"#/allOf/1/properties/axe/properties/critical/const",keyword:"const",params:{allowedValue: 0},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data18.serious !== undefined){
if(0 !== data18.serious){
const err34 = {instancePath:instancePath+"/axe/serious",schemaPath:"#/allOf/1/properties/axe/properties/serious/const",keyword:"const",params:{allowedValue: 0},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/axe",schemaPath:"#/allOf/1/properties/axe/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
}
else {
const err36 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
validate25.errors = vErrors;
return errors === 0;
}
validate25.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema63 = {"type":"array","minItems":3,"uniqueItems":true,"items":{"$ref":"#/$defs/nonEmpty"}};
function func0(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (a.constructor !== b.constructor) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let index = a.length; index-- !== 0;) {
        if (!func0(a[index], b[index])) return false;
      }
      return true;
    }
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    for (let index = keys.length; index-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[index])) return false;
    }
    for (let index = keys.length; index-- !== 0;) {
      const key = keys[index];
      if (!func0(a[key], b[key])) return false;
    }
    return true;
  }
  return a !== a && b !== b;
}

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate32.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length < 3){
const err0 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!pattern5.test(data0)){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
let i1 = data.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data[i1], data[j0])){
const err4 = {instancePath,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
break outer0;
}
}
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate32.errors = vErrors;
return errors === 0;
}
validate32.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema65 = {"type":"array","minItems":2,"uniqueItems":true,"items":{"$ref":"#/$defs/nonEmpty"}};

function validate34(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate34.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length < 2){
const err0 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!pattern5.test(data0)){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
let i1 = data.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data[i1], data[j0])){
const err4 = {instancePath,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
break outer0;
}
}
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate34.errors = vErrors;
return errors === 0;
}
validate34.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema68 = {"type":"object","additionalProperties":false,"required":["id","mode","name","signatureInteraction","medium","domainAnchor","conversionHypothesis","tradeoff","rejectionRisk","fingerprint"],"properties":{"id":{"$ref":"#/$defs/id"},"mode":{"enum":["commercially-safe","visually-ambitious","niche-native","counterfactual"]},"name":{"$ref":"#/$defs/nonEmpty"},"signatureInteraction":{"$ref":"#/$defs/nonEmpty"},"medium":{"$ref":"#/$defs/nonEmpty"},"domainAnchor":{"$ref":"#/$defs/nonEmpty"},"conversionHypothesis":{"$ref":"#/$defs/nonEmpty"},"tradeoff":{"$ref":"#/$defs/nonEmpty"},"rejectionRisk":{"$ref":"#/$defs/nonEmpty"},"fingerprint":{"$ref":"#/$defs/fingerprint"}}};
const schema77 = {"type":"object","additionalProperties":false,"required":["heroArchetype","composition","palette","geometry","primaryVisual","motionSignature","typography","sectionRhythm","headerArchitecture","heroFrame","scrollDepthSystem"],"properties":{"heroArchetype":{"$ref":"#/$defs/nonEmpty"},"composition":{"$ref":"#/$defs/nonEmpty"},"palette":{"$ref":"#/$defs/nonEmpty"},"geometry":{"$ref":"#/$defs/nonEmpty"},"primaryVisual":{"$ref":"#/$defs/nonEmpty"},"motionSignature":{"$ref":"#/$defs/nonEmpty"},"typography":{"$ref":"#/$defs/nonEmpty"},"sectionRhythm":{"$ref":"#/$defs/nonEmpty"},"headerArchitecture":{"$ref":"#/$defs/nonEmpty"},"heroFrame":{"$ref":"#/$defs/nonEmpty"},"scrollDepthSystem":{"$ref":"#/$defs/nonEmpty"}}};

function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate39.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.heroArchetype === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "heroArchetype"},message:"must have required property '"+"heroArchetype"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.composition === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "composition"},message:"must have required property '"+"composition"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.palette === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "palette"},message:"must have required property '"+"palette"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.geometry === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.primaryVisual === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "primaryVisual"},message:"must have required property '"+"primaryVisual"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.motionSignature === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "motionSignature"},message:"must have required property '"+"motionSignature"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.typography === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "typography"},message:"must have required property '"+"typography"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.sectionRhythm === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sectionRhythm"},message:"must have required property '"+"sectionRhythm"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.headerArchitecture === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "headerArchitecture"},message:"must have required property '"+"headerArchitecture"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.heroFrame === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "heroFrame"},message:"must have required property '"+"heroFrame"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.scrollDepthSystem === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scrollDepthSystem"},message:"must have required property '"+"scrollDepthSystem"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
for(const key0 in data){
if(!(func3.call(schema77.properties, key0))){
const err11 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.heroArchetype !== undefined){
let data0 = data.heroArchetype;
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err12 = {instancePath:instancePath+"/heroArchetype",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(!pattern5.test(data0)){
const err13 = {instancePath:instancePath+"/heroArchetype",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/heroArchetype",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.composition !== undefined){
let data1 = data.composition;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err15 = {instancePath:instancePath+"/composition",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(!pattern5.test(data1)){
const err16 = {instancePath:instancePath+"/composition",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/composition",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.palette !== undefined){
let data2 = data.palette;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err18 = {instancePath:instancePath+"/palette",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(!pattern5.test(data2)){
const err19 = {instancePath:instancePath+"/palette",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/palette",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.geometry !== undefined){
let data3 = data.geometry;
if(typeof data3 === "string"){
if(func1(data3) < 1){
const err21 = {instancePath:instancePath+"/geometry",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(!pattern5.test(data3)){
const err22 = {instancePath:instancePath+"/geometry",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/geometry",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.primaryVisual !== undefined){
let data4 = data.primaryVisual;
if(typeof data4 === "string"){
if(func1(data4) < 1){
const err24 = {instancePath:instancePath+"/primaryVisual",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(!pattern5.test(data4)){
const err25 = {instancePath:instancePath+"/primaryVisual",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/primaryVisual",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.motionSignature !== undefined){
let data5 = data.motionSignature;
if(typeof data5 === "string"){
if(func1(data5) < 1){
const err27 = {instancePath:instancePath+"/motionSignature",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!pattern5.test(data5)){
const err28 = {instancePath:instancePath+"/motionSignature",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/motionSignature",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.typography !== undefined){
let data6 = data.typography;
if(typeof data6 === "string"){
if(func1(data6) < 1){
const err30 = {instancePath:instancePath+"/typography",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(!pattern5.test(data6)){
const err31 = {instancePath:instancePath+"/typography",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/typography",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.sectionRhythm !== undefined){
let data7 = data.sectionRhythm;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err33 = {instancePath:instancePath+"/sectionRhythm",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(!pattern5.test(data7)){
const err34 = {instancePath:instancePath+"/sectionRhythm",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/sectionRhythm",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.headerArchitecture !== undefined){
let data8 = data.headerArchitecture;
if(typeof data8 === "string"){
if(func1(data8) < 1){
const err36 = {instancePath:instancePath+"/headerArchitecture",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(!pattern5.test(data8)){
const err37 = {instancePath:instancePath+"/headerArchitecture",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
else {
const err38 = {instancePath:instancePath+"/headerArchitecture",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.heroFrame !== undefined){
let data9 = data.heroFrame;
if(typeof data9 === "string"){
if(func1(data9) < 1){
const err39 = {instancePath:instancePath+"/heroFrame",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(!pattern5.test(data9)){
const err40 = {instancePath:instancePath+"/heroFrame",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/heroFrame",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.scrollDepthSystem !== undefined){
let data10 = data.scrollDepthSystem;
if(typeof data10 === "string"){
if(func1(data10) < 1){
const err42 = {instancePath:instancePath+"/scrollDepthSystem",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(!pattern5.test(data10)){
const err43 = {instancePath:instancePath+"/scrollDepthSystem",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/scrollDepthSystem",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
}
else {
const err45 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
validate39.errors = vErrors;
return errors === 0;
}
validate39.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate38(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate38.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.mode === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "mode"},message:"must have required property '"+"mode"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.name === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.signatureInteraction === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "signatureInteraction"},message:"must have required property '"+"signatureInteraction"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.medium === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "medium"},message:"must have required property '"+"medium"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.domainAnchor === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "domainAnchor"},message:"must have required property '"+"domainAnchor"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.conversionHypothesis === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "conversionHypothesis"},message:"must have required property '"+"conversionHypothesis"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.tradeoff === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "tradeoff"},message:"must have required property '"+"tradeoff"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.rejectionRisk === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rejectionRisk"},message:"must have required property '"+"rejectionRisk"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.fingerprint === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fingerprint"},message:"must have required property '"+"fingerprint"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key0 in data){
if(!(func3.call(schema68.properties, key0))){
const err10 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err11 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/id",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.mode !== undefined){
let data1 = data.mode;
if(!((((data1 === "commercially-safe") || (data1 === "visually-ambitious")) || (data1 === "niche-native")) || (data1 === "counterfactual"))){
const err13 = {instancePath:instancePath+"/mode",schemaPath:"#/properties/mode/enum",keyword:"enum",params:{allowedValues: schema68.properties.mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err14 = {instancePath:instancePath+"/name",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(!pattern5.test(data2)){
const err15 = {instancePath:instancePath+"/name",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/name",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.signatureInteraction !== undefined){
let data3 = data.signatureInteraction;
if(typeof data3 === "string"){
if(func1(data3) < 1){
const err17 = {instancePath:instancePath+"/signatureInteraction",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(!pattern5.test(data3)){
const err18 = {instancePath:instancePath+"/signatureInteraction",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/signatureInteraction",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.medium !== undefined){
let data4 = data.medium;
if(typeof data4 === "string"){
if(func1(data4) < 1){
const err20 = {instancePath:instancePath+"/medium",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(!pattern5.test(data4)){
const err21 = {instancePath:instancePath+"/medium",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/medium",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.domainAnchor !== undefined){
let data5 = data.domainAnchor;
if(typeof data5 === "string"){
if(func1(data5) < 1){
const err23 = {instancePath:instancePath+"/domainAnchor",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(!pattern5.test(data5)){
const err24 = {instancePath:instancePath+"/domainAnchor",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/domainAnchor",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.conversionHypothesis !== undefined){
let data6 = data.conversionHypothesis;
if(typeof data6 === "string"){
if(func1(data6) < 1){
const err26 = {instancePath:instancePath+"/conversionHypothesis",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(!pattern5.test(data6)){
const err27 = {instancePath:instancePath+"/conversionHypothesis",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
else {
const err28 = {instancePath:instancePath+"/conversionHypothesis",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.tradeoff !== undefined){
let data7 = data.tradeoff;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err29 = {instancePath:instancePath+"/tradeoff",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(!pattern5.test(data7)){
const err30 = {instancePath:instancePath+"/tradeoff",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/tradeoff",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.rejectionRisk !== undefined){
let data8 = data.rejectionRisk;
if(typeof data8 === "string"){
if(func1(data8) < 1){
const err32 = {instancePath:instancePath+"/rejectionRisk",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(!pattern5.test(data8)){
const err33 = {instancePath:instancePath+"/rejectionRisk",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/rejectionRisk",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.fingerprint !== undefined){
if(!(validate39(data.fingerprint, {instancePath:instancePath+"/fingerprint",parentData:data,parentDataProperty:"fingerprint",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
errors = vErrors.length;
}
}
}
else {
const err35 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
validate38.errors = vErrors;
return errors === 0;
}
validate38.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const pattern62 = new RegExp("^#[0-9A-Fa-f]{6}$", "u");

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://demeta.dev/schemas/design-manifest-2.0.0.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.stage === undefined) && (missing0 = "stage")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.stage !== undefined){
let data0 = data.stage;
if(!((data0 === "production") || (data0 === "verified"))){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.claims !== undefined){
let data1 = data.claims;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(!(validate21(data2, {instancePath:instancePath+"/claims/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.status !== undefined){
let data3 = data2.status;
if(!((data3 === "verified") || (data3 === "user_supplied"))){
const err2 = {instancePath:instancePath+"/claims/" + i0+"/status",schemaPath:"#/allOf/0/then/properties/claims/items/allOf/1/properties/status/enum",keyword:"enum",params:{allowedValues: schema31.allOf[0].then.properties.claims.items.allOf[1].properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
else {
const err3 = {instancePath:instancePath+"/claims/" + i0,schemaPath:"#/allOf/0/then/properties/claims/items/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath:instancePath+"/claims",schemaPath:"#/allOf/0/then/properties/claims/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.assets !== undefined){
let data4 = data.assets;
if(Array.isArray(data4)){
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
let data5 = data4[i1];
if(!(validate23(data5, {instancePath:instancePath+"/assets/" + i1,parentData:data4,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.sha256 === undefined){
const err5 = {instancePath:instancePath+"/assets/" + i1,schemaPath:"#/allOf/0/then/properties/assets/items/allOf/1/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/assets/" + i1,schemaPath:"#/allOf/0/then/properties/assets/items/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
else {
const err7 = {instancePath:instancePath+"/assets",schemaPath:"#/allOf/0/then/properties/assets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.evidence !== undefined){
let data6 = data.evidence;
if(!(data6 && typeof data6 == "object" && !Array.isArray(data6))){
const err8 = {instancePath:instancePath+"/evidence",schemaPath:"#/allOf/0/then/properties/evidence/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(!(validate25(data6, {instancePath:instancePath+"/evidence",parentData:data,parentDataProperty:"evidence",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
}
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
if(valid1){
var props0 = {};
props0.claims = true;
props0.assets = true;
props0.evidence = true;
props0.stage = true;
}
}
if(!valid1){
const err9 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.version === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.stage === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "stage"},message:"must have required property '"+"stage"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.project === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "project"},message:"must have required property '"+"project"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.thesis === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "thesis"},message:"must have required property '"+"thesis"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.nicheIntelligence === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "nicheIntelligence"},message:"must have required property '"+"nicheIntelligence"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.concepts === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "concepts"},message:"must have required property '"+"concepts"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.selectedConcept === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "selectedConcept"},message:"must have required property '"+"selectedConcept"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.selectionRationale === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "selectionRationale"},message:"must have required property '"+"selectionRationale"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.system === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "system"},message:"must have required property '"+"system"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data.architecture === undefined){
const err19 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "architecture"},message:"must have required property '"+"architecture"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data.graphics === undefined){
const err20 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "graphics"},message:"must have required property '"+"graphics"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data.motion === undefined){
const err21 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "motion"},message:"must have required property '"+"motion"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data.accessibility === undefined){
const err22 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "accessibility"},message:"must have required property '"+"accessibility"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data.performanceBudget === undefined){
const err23 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "performanceBudget"},message:"must have required property '"+"performanceBudget"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data.claims === undefined){
const err24 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "claims"},message:"must have required property '"+"claims"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data.assets === undefined){
const err25 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assets"},message:"must have required property '"+"assets"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data.evidence === undefined){
const err26 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence"},message:"must have required property '"+"evidence"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
for(const key0 in data){
if(!(func3.call(schema31.properties, key0))){
const err27 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.$schema !== undefined){
let data7 = data.$schema;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err28 = {instancePath:instancePath+"/$schema",schemaPath:"#/properties/%24schema/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/$schema",schemaPath:"#/properties/%24schema/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.version !== undefined){
if("2.0.0" !== data.version){
const err30 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: "2.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data.stage !== undefined){
let data9 = data.stage;
if(!((((data9 === "plan") || (data9 === "draft")) || (data9 === "production")) || (data9 === "verified"))){
const err31 = {instancePath:instancePath+"/stage",schemaPath:"#/properties/stage/enum",keyword:"enum",params:{allowedValues: schema31.properties.stage.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.project !== undefined){
let data10 = data.project;
if(data10 && typeof data10 == "object" && !Array.isArray(data10)){
if(data10.name === undefined){
const err32 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data10.niche === undefined){
const err33 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "niche"},message:"must have required property '"+"niche"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data10.audience === undefined){
const err34 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "audience"},message:"must have required property '"+"audience"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data10.singleJob === undefined){
const err35 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "singleJob"},message:"must have required property '"+"singleJob"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data10.ambition === undefined){
const err36 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "ambition"},message:"must have required property '"+"ambition"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data10.locale === undefined){
const err37 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/required",keyword:"required",params:{missingProperty: "locale"},message:"must have required property '"+"locale"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
for(const key1 in data10){
if(!((((((key1 === "name") || (key1 === "niche")) || (key1 === "audience")) || (key1 === "singleJob")) || (key1 === "ambition")) || (key1 === "locale"))){
const err38 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data10.name !== undefined){
let data11 = data10.name;
if(typeof data11 === "string"){
if(func1(data11) < 1){
const err39 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(!pattern5.test(data11)){
const err40 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data10.niche !== undefined){
let data12 = data10.niche;
if(typeof data12 === "string"){
if(func1(data12) < 1){
const err42 = {instancePath:instancePath+"/project/niche",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(!pattern5.test(data12)){
const err43 = {instancePath:instancePath+"/project/niche",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/project/niche",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data10.audience !== undefined){
let data13 = data10.audience;
if(typeof data13 === "string"){
if(func1(data13) < 1){
const err45 = {instancePath:instancePath+"/project/audience",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(!pattern5.test(data13)){
const err46 = {instancePath:instancePath+"/project/audience",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
else {
const err47 = {instancePath:instancePath+"/project/audience",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data10.singleJob !== undefined){
let data14 = data10.singleJob;
if(typeof data14 === "string"){
if(func1(data14) < 1){
const err48 = {instancePath:instancePath+"/project/singleJob",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(!pattern5.test(data14)){
const err49 = {instancePath:instancePath+"/project/singleJob",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/project/singleJob",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data10.ambition !== undefined){
let data15 = data10.ambition;
if(!(((data15 === "flagship") || (data15 === "experimental")) || (data15 === "campaign"))){
const err51 = {instancePath:instancePath+"/project/ambition",schemaPath:"#/properties/project/properties/ambition/enum",keyword:"enum",params:{allowedValues: schema31.properties.project.properties.ambition.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data10.locale !== undefined){
let data16 = data10.locale;
if(typeof data16 === "string"){
if(func1(data16) < 1){
const err52 = {instancePath:instancePath+"/project/locale",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(!pattern5.test(data16)){
const err53 = {instancePath:instancePath+"/project/locale",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/project/locale",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath:instancePath+"/project",schemaPath:"#/properties/project/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.thesis !== undefined){
let data17 = data.thesis;
if(data17 && typeof data17 == "object" && !Array.isArray(data17)){
if(data17.concept === undefined){
const err56 = {instancePath:instancePath+"/thesis",schemaPath:"#/properties/thesis/required",keyword:"required",params:{missingProperty: "concept"},message:"must have required property '"+"concept"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data17.signature === undefined){
const err57 = {instancePath:instancePath+"/thesis",schemaPath:"#/properties/thesis/required",keyword:"required",params:{missingProperty: "signature"},message:"must have required property '"+"signature"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(data17.aestheticRisk === undefined){
const err58 = {instancePath:instancePath+"/thesis",schemaPath:"#/properties/thesis/required",keyword:"required",params:{missingProperty: "aestheticRisk"},message:"must have required property '"+"aestheticRisk"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data17.restraint === undefined){
const err59 = {instancePath:instancePath+"/thesis",schemaPath:"#/properties/thesis/required",keyword:"required",params:{missingProperty: "restraint"},message:"must have required property '"+"restraint"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
for(const key2 in data17){
if(!((((key2 === "concept") || (key2 === "signature")) || (key2 === "aestheticRisk")) || (key2 === "restraint"))){
const err60 = {instancePath:instancePath+"/thesis",schemaPath:"#/properties/thesis/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data17.concept !== undefined){
let data18 = data17.concept;
if(typeof data18 === "string"){
if(func1(data18) < 1){
const err61 = {instancePath:instancePath+"/thesis/concept",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(!pattern5.test(data18)){
const err62 = {instancePath:instancePath+"/thesis/concept",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
else {
const err63 = {instancePath:instancePath+"/thesis/concept",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data17.signature !== undefined){
let data19 = data17.signature;
if(typeof data19 === "string"){
if(func1(data19) < 1){
const err64 = {instancePath:instancePath+"/thesis/signature",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(!pattern5.test(data19)){
const err65 = {instancePath:instancePath+"/thesis/signature",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
else {
const err66 = {instancePath:instancePath+"/thesis/signature",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data17.aestheticRisk !== undefined){
let data20 = data17.aestheticRisk;
if(typeof data20 === "string"){
if(func1(data20) < 1){
const err67 = {instancePath:instancePath+"/thesis/aestheticRisk",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(!pattern5.test(data20)){
const err68 = {instancePath:instancePath+"/thesis/aestheticRisk",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/thesis/aestheticRisk",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data17.restraint !== undefined){
let data21 = data17.restraint;
if(typeof data21 === "string"){
if(func1(data21) < 1){
const err70 = {instancePath:instancePath+"/thesis/restraint",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(!pattern5.test(data21)){
const err71 = {instancePath:instancePath+"/thesis/restraint",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
else {
const err72 = {instancePath:instancePath+"/thesis/restraint",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/thesis",schemaPath:"#/properties/thesis/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data.nicheIntelligence !== undefined){
let data22 = data.nicheIntelligence;
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.artifacts === undefined){
const err74 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/required",keyword:"required",params:{missingProperty: "artifacts"},message:"must have required property '"+"artifacts"+"'"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(data22.rituals === undefined){
const err75 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/required",keyword:"required",params:{missingProperty: "rituals"},message:"must have required property '"+"rituals"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data22.proofSignals === undefined){
const err76 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/required",keyword:"required",params:{missingProperty: "proofSignals"},message:"must have required property '"+"proofSignals"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data22.sensoryCues === undefined){
const err77 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/required",keyword:"required",params:{missingProperty: "sensoryCues"},message:"must have required property '"+"sensoryCues"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data22.conversionAction === undefined){
const err78 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/required",keyword:"required",params:{missingProperty: "conversionAction"},message:"must have required property '"+"conversionAction"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
for(const key3 in data22){
if(!(((((key3 === "artifacts") || (key3 === "rituals")) || (key3 === "proofSignals")) || (key3 === "sensoryCues")) || (key3 === "conversionAction"))){
const err79 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data22.artifacts !== undefined){
if(!(validate32(data22.artifacts, {instancePath:instancePath+"/nicheIntelligence/artifacts",parentData:data22,parentDataProperty:"artifacts",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
}
if(data22.rituals !== undefined){
if(!(validate34(data22.rituals, {instancePath:instancePath+"/nicheIntelligence/rituals",parentData:data22,parentDataProperty:"rituals",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
errors = vErrors.length;
}
}
if(data22.proofSignals !== undefined){
if(!(validate34(data22.proofSignals, {instancePath:instancePath+"/nicheIntelligence/proofSignals",parentData:data22,parentDataProperty:"proofSignals",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
errors = vErrors.length;
}
}
if(data22.sensoryCues !== undefined){
if(!(validate34(data22.sensoryCues, {instancePath:instancePath+"/nicheIntelligence/sensoryCues",parentData:data22,parentDataProperty:"sensoryCues",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
errors = vErrors.length;
}
}
if(data22.conversionAction !== undefined){
let data27 = data22.conversionAction;
if(typeof data27 === "string"){
if(func1(data27) < 1){
const err80 = {instancePath:instancePath+"/nicheIntelligence/conversionAction",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if(!pattern5.test(data27)){
const err81 = {instancePath:instancePath+"/nicheIntelligence/conversionAction",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
else {
const err82 = {instancePath:instancePath+"/nicheIntelligence/conversionAction",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
}
else {
const err83 = {instancePath:instancePath+"/nicheIntelligence",schemaPath:"#/properties/nicheIntelligence/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data.concepts !== undefined){
let data28 = data.concepts;
if(Array.isArray(data28)){
if(data28.length > 5){
const err84 = {instancePath:instancePath+"/concepts",schemaPath:"#/properties/concepts/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data28.length < 3){
const err85 = {instancePath:instancePath+"/concepts",schemaPath:"#/properties/concepts/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
const len2 = data28.length;
for(let i2=0; i2<len2; i2++){
if(!(validate38(data28[i2], {instancePath:instancePath+"/concepts/" + i2,parentData:data28,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate38.errors : vErrors.concat(validate38.errors);
errors = vErrors.length;
}
}
}
else {
const err86 = {instancePath:instancePath+"/concepts",schemaPath:"#/properties/concepts/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data.selectedConcept !== undefined){
let data30 = data.selectedConcept;
if(typeof data30 === "string"){
if(!pattern4.test(data30)){
const err87 = {instancePath:instancePath+"/selectedConcept",schemaPath:"#/$defs/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
else {
const err88 = {instancePath:instancePath+"/selectedConcept",schemaPath:"#/$defs/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data.selectionRationale !== undefined){
let data31 = data.selectionRationale;
if(typeof data31 === "string"){
if(func1(data31) < 1){
const err89 = {instancePath:instancePath+"/selectionRationale",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(!pattern5.test(data31)){
const err90 = {instancePath:instancePath+"/selectionRationale",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
else {
const err91 = {instancePath:instancePath+"/selectionRationale",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data.system !== undefined){
let data32 = data.system;
if(data32 && typeof data32 == "object" && !Array.isArray(data32)){
if(data32.colors === undefined){
const err92 = {instancePath:instancePath+"/system",schemaPath:"#/properties/system/required",keyword:"required",params:{missingProperty: "colors"},message:"must have required property '"+"colors"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data32.typography === undefined){
const err93 = {instancePath:instancePath+"/system",schemaPath:"#/properties/system/required",keyword:"required",params:{missingProperty: "typography"},message:"must have required property '"+"typography"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data32.geometry === undefined){
const err94 = {instancePath:instancePath+"/system",schemaPath:"#/properties/system/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data32.material === undefined){
const err95 = {instancePath:instancePath+"/system",schemaPath:"#/properties/system/required",keyword:"required",params:{missingProperty: "material"},message:"must have required property '"+"material"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
for(const key4 in data32){
if(!((((key4 === "colors") || (key4 === "typography")) || (key4 === "geometry")) || (key4 === "material"))){
const err96 = {instancePath:instancePath+"/system",schemaPath:"#/properties/system/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data32.colors !== undefined){
let data33 = data32.colors;
if(Array.isArray(data33)){
if(data33.length > 7){
const err97 = {instancePath:instancePath+"/system/colors",schemaPath:"#/properties/system/properties/colors/maxItems",keyword:"maxItems",params:{limit: 7},message:"must NOT have more than 7 items"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
if(data33.length < 4){
const err98 = {instancePath:instancePath+"/system/colors",schemaPath:"#/properties/system/properties/colors/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
const len3 = data33.length;
for(let i3=0; i3<len3; i3++){
let data34 = data33[i3];
if(data34 && typeof data34 == "object" && !Array.isArray(data34)){
if(data34.name === undefined){
const err99 = {instancePath:instancePath+"/system/colors/" + i3,schemaPath:"#/properties/system/properties/colors/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
if(data34.value === undefined){
const err100 = {instancePath:instancePath+"/system/colors/" + i3,schemaPath:"#/properties/system/properties/colors/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
if(data34.role === undefined){
const err101 = {instancePath:instancePath+"/system/colors/" + i3,schemaPath:"#/properties/system/properties/colors/items/required",keyword:"required",params:{missingProperty: "role"},message:"must have required property '"+"role"+"'"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
for(const key5 in data34){
if(!(((key5 === "name") || (key5 === "value")) || (key5 === "role"))){
const err102 = {instancePath:instancePath+"/system/colors/" + i3,schemaPath:"#/properties/system/properties/colors/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
if(data34.name !== undefined){
let data35 = data34.name;
if(typeof data35 === "string"){
if(func1(data35) < 1){
const err103 = {instancePath:instancePath+"/system/colors/" + i3+"/name",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(!pattern5.test(data35)){
const err104 = {instancePath:instancePath+"/system/colors/" + i3+"/name",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
else {
const err105 = {instancePath:instancePath+"/system/colors/" + i3+"/name",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data34.value !== undefined){
let data36 = data34.value;
if(typeof data36 === "string"){
if(!pattern62.test(data36)){
const err106 = {instancePath:instancePath+"/system/colors/" + i3+"/value",schemaPath:"#/properties/system/properties/colors/items/properties/value/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
else {
const err107 = {instancePath:instancePath+"/system/colors/" + i3+"/value",schemaPath:"#/properties/system/properties/colors/items/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data34.role !== undefined){
let data37 = data34.role;
if(typeof data37 === "string"){
if(func1(data37) < 1){
const err108 = {instancePath:instancePath+"/system/colors/" + i3+"/role",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(!pattern5.test(data37)){
const err109 = {instancePath:instancePath+"/system/colors/" + i3+"/role",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
else {
const err110 = {instancePath:instancePath+"/system/colors/" + i3+"/role",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
}
else {
const err111 = {instancePath:instancePath+"/system/colors/" + i3,schemaPath:"#/properties/system/properties/colors/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
}
else {
const err112 = {instancePath:instancePath+"/system/colors",schemaPath:"#/properties/system/properties/colors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data32.typography !== undefined){
let data38 = data32.typography;
if(data38 && typeof data38 == "object" && !Array.isArray(data38)){
if(data38.display === undefined){
const err113 = {instancePath:instancePath+"/system/typography",schemaPath:"#/properties/system/properties/typography/required",keyword:"required",params:{missingProperty: "display"},message:"must have required property '"+"display"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data38.body === undefined){
const err114 = {instancePath:instancePath+"/system/typography",schemaPath:"#/properties/system/properties/typography/required",keyword:"required",params:{missingProperty: "body"},message:"must have required property '"+"body"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data38.utility === undefined){
const err115 = {instancePath:instancePath+"/system/typography",schemaPath:"#/properties/system/properties/typography/required",keyword:"required",params:{missingProperty: "utility"},message:"must have required property '"+"utility"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
for(const key6 in data38){
if(!(((key6 === "display") || (key6 === "body")) || (key6 === "utility"))){
const err116 = {instancePath:instancePath+"/system/typography",schemaPath:"#/properties/system/properties/typography/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data38.display !== undefined){
let data39 = data38.display;
if(typeof data39 === "string"){
if(func1(data39) < 1){
const err117 = {instancePath:instancePath+"/system/typography/display",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
if(!pattern5.test(data39)){
const err118 = {instancePath:instancePath+"/system/typography/display",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/system/typography/display",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data38.body !== undefined){
let data40 = data38.body;
if(typeof data40 === "string"){
if(func1(data40) < 1){
const err120 = {instancePath:instancePath+"/system/typography/body",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(!pattern5.test(data40)){
const err121 = {instancePath:instancePath+"/system/typography/body",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
else {
const err122 = {instancePath:instancePath+"/system/typography/body",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data38.utility !== undefined){
let data41 = data38.utility;
if(typeof data41 === "string"){
if(func1(data41) < 1){
const err123 = {instancePath:instancePath+"/system/typography/utility",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
if(!pattern5.test(data41)){
const err124 = {instancePath:instancePath+"/system/typography/utility",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
else {
const err125 = {instancePath:instancePath+"/system/typography/utility",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
}
else {
const err126 = {instancePath:instancePath+"/system/typography",schemaPath:"#/properties/system/properties/typography/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data32.geometry !== undefined){
let data42 = data32.geometry;
if(typeof data42 === "string"){
if(func1(data42) < 1){
const err127 = {instancePath:instancePath+"/system/geometry",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
if(!pattern5.test(data42)){
const err128 = {instancePath:instancePath+"/system/geometry",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
else {
const err129 = {instancePath:instancePath+"/system/geometry",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data32.material !== undefined){
let data43 = data32.material;
if(typeof data43 === "string"){
if(func1(data43) < 1){
const err130 = {instancePath:instancePath+"/system/material",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if(!pattern5.test(data43)){
const err131 = {instancePath:instancePath+"/system/material",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
else {
const err132 = {instancePath:instancePath+"/system/material",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
else {
const err133 = {instancePath:instancePath+"/system",schemaPath:"#/properties/system/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data.architecture !== undefined){
let data44 = data.architecture;
if(data44 && typeof data44 == "object" && !Array.isArray(data44)){
if(data44.header === undefined){
const err134 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/required",keyword:"required",params:{missingProperty: "header"},message:"must have required property '"+"header"+"'"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
if(data44.heroFrame === undefined){
const err135 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/required",keyword:"required",params:{missingProperty: "heroFrame"},message:"must have required property '"+"heroFrame"+"'"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(data44.sections === undefined){
const err136 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/required",keyword:"required",params:{missingProperty: "sections"},message:"must have required property '"+"sections"+"'"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data44.scrollDepth === undefined){
const err137 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/required",keyword:"required",params:{missingProperty: "scrollDepth"},message:"must have required property '"+"scrollDepth"+"'"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
if(data44.mobileMutation === undefined){
const err138 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/required",keyword:"required",params:{missingProperty: "mobileMutation"},message:"must have required property '"+"mobileMutation"+"'"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
for(const key7 in data44){
if(!(((((key7 === "header") || (key7 === "heroFrame")) || (key7 === "sections")) || (key7 === "scrollDepth")) || (key7 === "mobileMutation"))){
const err139 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
if(data44.header !== undefined){
let data45 = data44.header;
if(typeof data45 === "string"){
if(func1(data45) < 1){
const err140 = {instancePath:instancePath+"/architecture/header",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(!pattern5.test(data45)){
const err141 = {instancePath:instancePath+"/architecture/header",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
else {
const err142 = {instancePath:instancePath+"/architecture/header",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data44.heroFrame !== undefined){
let data46 = data44.heroFrame;
if(typeof data46 === "string"){
if(func1(data46) < 1){
const err143 = {instancePath:instancePath+"/architecture/heroFrame",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
if(!pattern5.test(data46)){
const err144 = {instancePath:instancePath+"/architecture/heroFrame",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
else {
const err145 = {instancePath:instancePath+"/architecture/heroFrame",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data44.sections !== undefined){
if(!(validate32(data44.sections, {instancePath:instancePath+"/architecture/sections",parentData:data44,parentDataProperty:"sections",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
}
if(data44.scrollDepth !== undefined){
let data48 = data44.scrollDepth;
if(typeof data48 === "string"){
if(func1(data48) < 1){
const err146 = {instancePath:instancePath+"/architecture/scrollDepth",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
if(!pattern5.test(data48)){
const err147 = {instancePath:instancePath+"/architecture/scrollDepth",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
else {
const err148 = {instancePath:instancePath+"/architecture/scrollDepth",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
if(data44.mobileMutation !== undefined){
let data49 = data44.mobileMutation;
if(typeof data49 === "string"){
if(func1(data49) < 1){
const err149 = {instancePath:instancePath+"/architecture/mobileMutation",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
if(!pattern5.test(data49)){
const err150 = {instancePath:instancePath+"/architecture/mobileMutation",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
else {
const err151 = {instancePath:instancePath+"/architecture/mobileMutation",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
}
else {
const err152 = {instancePath:instancePath+"/architecture",schemaPath:"#/properties/architecture/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
if(data.graphics !== undefined){
let data50 = data.graphics;
if(data50 && typeof data50 == "object" && !Array.isArray(data50)){
if(data50.primaryMedium === undefined){
const err153 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/required",keyword:"required",params:{missingProperty: "primaryMedium"},message:"must have required property '"+"primaryMedium"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(data50.justification === undefined){
const err154 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/required",keyword:"required",params:{missingProperty: "justification"},message:"must have required property '"+"justification"+"'"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data50.criticalContentInDom === undefined){
const err155 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/required",keyword:"required",params:{missingProperty: "criticalContentInDom"},message:"must have required property '"+"criticalContentInDom"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data50.fallbacks === undefined){
const err156 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/required",keyword:"required",params:{missingProperty: "fallbacks"},message:"must have required property '"+"fallbacks"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(data50.runtime === undefined){
const err157 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/required",keyword:"required",params:{missingProperty: "runtime"},message:"must have required property '"+"runtime"+"'"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
for(const key8 in data50){
if(!(((((key8 === "primaryMedium") || (key8 === "justification")) || (key8 === "criticalContentInDom")) || (key8 === "fallbacks")) || (key8 === "runtime"))){
const err158 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
if(data50.primaryMedium !== undefined){
let data51 = data50.primaryMedium;
if(typeof data51 === "string"){
if(func1(data51) < 1){
const err159 = {instancePath:instancePath+"/graphics/primaryMedium",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
if(!pattern5.test(data51)){
const err160 = {instancePath:instancePath+"/graphics/primaryMedium",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
else {
const err161 = {instancePath:instancePath+"/graphics/primaryMedium",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data50.justification !== undefined){
let data52 = data50.justification;
if(typeof data52 === "string"){
if(func1(data52) < 1){
const err162 = {instancePath:instancePath+"/graphics/justification",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
if(!pattern5.test(data52)){
const err163 = {instancePath:instancePath+"/graphics/justification",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
else {
const err164 = {instancePath:instancePath+"/graphics/justification",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data50.criticalContentInDom !== undefined){
if(typeof data50.criticalContentInDom !== "boolean"){
const err165 = {instancePath:instancePath+"/graphics/criticalContentInDom",schemaPath:"#/properties/graphics/properties/criticalContentInDom/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data50.fallbacks !== undefined){
let data54 = data50.fallbacks;
if(data54 && typeof data54 == "object" && !Array.isArray(data54)){
if(data54.noWebGL === undefined){
const err166 = {instancePath:instancePath+"/graphics/fallbacks",schemaPath:"#/properties/graphics/properties/fallbacks/required",keyword:"required",params:{missingProperty: "noWebGL"},message:"must have required property '"+"noWebGL"+"'"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if(data54.reducedMotion === undefined){
const err167 = {instancePath:instancePath+"/graphics/fallbacks",schemaPath:"#/properties/graphics/properties/fallbacks/required",keyword:"required",params:{missingProperty: "reducedMotion"},message:"must have required property '"+"reducedMotion"+"'"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
if(data54.lowPower === undefined){
const err168 = {instancePath:instancePath+"/graphics/fallbacks",schemaPath:"#/properties/graphics/properties/fallbacks/required",keyword:"required",params:{missingProperty: "lowPower"},message:"must have required property '"+"lowPower"+"'"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if(data54.assetFailure === undefined){
const err169 = {instancePath:instancePath+"/graphics/fallbacks",schemaPath:"#/properties/graphics/properties/fallbacks/required",keyword:"required",params:{missingProperty: "assetFailure"},message:"must have required property '"+"assetFailure"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
for(const key9 in data54){
if(!((((key9 === "noWebGL") || (key9 === "reducedMotion")) || (key9 === "lowPower")) || (key9 === "assetFailure"))){
const err170 = {instancePath:instancePath+"/graphics/fallbacks",schemaPath:"#/properties/graphics/properties/fallbacks/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
}
if(data54.noWebGL !== undefined){
let data55 = data54.noWebGL;
if(typeof data55 === "string"){
if(func1(data55) < 1){
const err171 = {instancePath:instancePath+"/graphics/fallbacks/noWebGL",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(!pattern5.test(data55)){
const err172 = {instancePath:instancePath+"/graphics/fallbacks/noWebGL",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
else {
const err173 = {instancePath:instancePath+"/graphics/fallbacks/noWebGL",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data54.reducedMotion !== undefined){
let data56 = data54.reducedMotion;
if(typeof data56 === "string"){
if(func1(data56) < 1){
const err174 = {instancePath:instancePath+"/graphics/fallbacks/reducedMotion",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(!pattern5.test(data56)){
const err175 = {instancePath:instancePath+"/graphics/fallbacks/reducedMotion",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
else {
const err176 = {instancePath:instancePath+"/graphics/fallbacks/reducedMotion",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
if(data54.lowPower !== undefined){
let data57 = data54.lowPower;
if(typeof data57 === "string"){
if(func1(data57) < 1){
const err177 = {instancePath:instancePath+"/graphics/fallbacks/lowPower",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
if(!pattern5.test(data57)){
const err178 = {instancePath:instancePath+"/graphics/fallbacks/lowPower",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
else {
const err179 = {instancePath:instancePath+"/graphics/fallbacks/lowPower",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
if(data54.assetFailure !== undefined){
let data58 = data54.assetFailure;
if(typeof data58 === "string"){
if(func1(data58) < 1){
const err180 = {instancePath:instancePath+"/graphics/fallbacks/assetFailure",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
if(!pattern5.test(data58)){
const err181 = {instancePath:instancePath+"/graphics/fallbacks/assetFailure",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
else {
const err182 = {instancePath:instancePath+"/graphics/fallbacks/assetFailure",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
}
else {
const err183 = {instancePath:instancePath+"/graphics/fallbacks",schemaPath:"#/properties/graphics/properties/fallbacks/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
if(data50.runtime !== undefined){
let data59 = data50.runtime;
if(data59 && typeof data59 == "object" && !Array.isArray(data59)){
if(data59.lazyLoaded === undefined){
const err184 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/required",keyword:"required",params:{missingProperty: "lazyLoaded"},message:"must have required property '"+"lazyLoaded"+"'"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(data59.pauseWhenHidden === undefined){
const err185 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/required",keyword:"required",params:{missingProperty: "pauseWhenHidden"},message:"must have required property '"+"pauseWhenHidden"+"'"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
if(data59.pauseControl === undefined){
const err186 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/required",keyword:"required",params:{missingProperty: "pauseControl"},message:"must have required property '"+"pauseControl"+"'"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
if(data59.disposeOnUnmount === undefined){
const err187 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/required",keyword:"required",params:{missingProperty: "disposeOnUnmount"},message:"must have required property '"+"disposeOnUnmount"+"'"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
if(data59.handlesContextLoss === undefined){
const err188 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/required",keyword:"required",params:{missingProperty: "handlesContextLoss"},message:"must have required property '"+"handlesContextLoss"+"'"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
for(const key10 in data59){
if(!(((((key10 === "lazyLoaded") || (key10 === "pauseWhenHidden")) || (key10 === "pauseControl")) || (key10 === "disposeOnUnmount")) || (key10 === "handlesContextLoss"))){
const err189 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
if(data59.lazyLoaded !== undefined){
if(typeof data59.lazyLoaded !== "boolean"){
const err190 = {instancePath:instancePath+"/graphics/runtime/lazyLoaded",schemaPath:"#/properties/graphics/properties/runtime/properties/lazyLoaded/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
if(data59.pauseWhenHidden !== undefined){
if(typeof data59.pauseWhenHidden !== "boolean"){
const err191 = {instancePath:instancePath+"/graphics/runtime/pauseWhenHidden",schemaPath:"#/properties/graphics/properties/runtime/properties/pauseWhenHidden/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data59.pauseControl !== undefined){
if(typeof data59.pauseControl !== "boolean"){
const err192 = {instancePath:instancePath+"/graphics/runtime/pauseControl",schemaPath:"#/properties/graphics/properties/runtime/properties/pauseControl/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
if(data59.disposeOnUnmount !== undefined){
if(typeof data59.disposeOnUnmount !== "boolean"){
const err193 = {instancePath:instancePath+"/graphics/runtime/disposeOnUnmount",schemaPath:"#/properties/graphics/properties/runtime/properties/disposeOnUnmount/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data59.handlesContextLoss !== undefined){
if(typeof data59.handlesContextLoss !== "boolean"){
const err194 = {instancePath:instancePath+"/graphics/runtime/handlesContextLoss",schemaPath:"#/properties/graphics/properties/runtime/properties/handlesContextLoss/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
}
else {
const err195 = {instancePath:instancePath+"/graphics/runtime",schemaPath:"#/properties/graphics/properties/runtime/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
}
else {
const err196 = {instancePath:instancePath+"/graphics",schemaPath:"#/properties/graphics/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
if(data.motion !== undefined){
let data65 = data.motion;
if(data65 && typeof data65 == "object" && !Array.isArray(data65)){
if(data65.entrance === undefined){
const err197 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/required",keyword:"required",params:{missingProperty: "entrance"},message:"must have required property '"+"entrance"+"'"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
if(data65.nicheMoment === undefined){
const err198 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/required",keyword:"required",params:{missingProperty: "nicheMoment"},message:"must have required property '"+"nicheMoment"+"'"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
if(data65.reducedMotionStrategy === undefined){
const err199 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/required",keyword:"required",params:{missingProperty: "reducedMotionStrategy"},message:"must have required property '"+"reducedMotionStrategy"+"'"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
if(data65.autoMotionOverFiveSeconds === undefined){
const err200 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/required",keyword:"required",params:{missingProperty: "autoMotionOverFiveSeconds"},message:"must have required property '"+"autoMotionOverFiveSeconds"+"'"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
if(data65.pauseControl === undefined){
const err201 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/required",keyword:"required",params:{missingProperty: "pauseControl"},message:"must have required property '"+"pauseControl"+"'"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
for(const key11 in data65){
if(!(((((key11 === "entrance") || (key11 === "nicheMoment")) || (key11 === "reducedMotionStrategy")) || (key11 === "autoMotionOverFiveSeconds")) || (key11 === "pauseControl"))){
const err202 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
}
if(data65.entrance !== undefined){
let data66 = data65.entrance;
if(typeof data66 === "string"){
if(func1(data66) < 1){
const err203 = {instancePath:instancePath+"/motion/entrance",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
if(!pattern5.test(data66)){
const err204 = {instancePath:instancePath+"/motion/entrance",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
else {
const err205 = {instancePath:instancePath+"/motion/entrance",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
if(data65.nicheMoment !== undefined){
let data67 = data65.nicheMoment;
if(typeof data67 === "string"){
if(func1(data67) < 1){
const err206 = {instancePath:instancePath+"/motion/nicheMoment",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
if(!pattern5.test(data67)){
const err207 = {instancePath:instancePath+"/motion/nicheMoment",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
else {
const err208 = {instancePath:instancePath+"/motion/nicheMoment",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
}
if(data65.reducedMotionStrategy !== undefined){
let data68 = data65.reducedMotionStrategy;
if(typeof data68 === "string"){
if(func1(data68) < 1){
const err209 = {instancePath:instancePath+"/motion/reducedMotionStrategy",schemaPath:"#/$defs/nonEmpty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
if(!pattern5.test(data68)){
const err210 = {instancePath:instancePath+"/motion/reducedMotionStrategy",schemaPath:"#/$defs/nonEmpty/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
else {
const err211 = {instancePath:instancePath+"/motion/reducedMotionStrategy",schemaPath:"#/$defs/nonEmpty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data65.autoMotionOverFiveSeconds !== undefined){
if(typeof data65.autoMotionOverFiveSeconds !== "boolean"){
const err212 = {instancePath:instancePath+"/motion/autoMotionOverFiveSeconds",schemaPath:"#/properties/motion/properties/autoMotionOverFiveSeconds/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
}
if(data65.pauseControl !== undefined){
if(typeof data65.pauseControl !== "boolean"){
const err213 = {instancePath:instancePath+"/motion/pauseControl",schemaPath:"#/properties/motion/properties/pauseControl/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
}
else {
const err214 = {instancePath:instancePath+"/motion",schemaPath:"#/properties/motion/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
if(data.accessibility !== undefined){
let data71 = data.accessibility;
if(data71 && typeof data71 == "object" && !Array.isArray(data71)){
if(data71.target === undefined){
const err215 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "target"},message:"must have required property '"+"target"+"'"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
if(data71.semanticDom === undefined){
const err216 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "semanticDom"},message:"must have required property '"+"semanticDom"+"'"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
if(data71.keyboardComplete === undefined){
const err217 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "keyboardComplete"},message:"must have required property '"+"keyboardComplete"+"'"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
if(data71.visibleFocus === undefined){
const err218 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "visibleFocus"},message:"must have required property '"+"visibleFocus"+"'"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
if(data71.contrastChecked === undefined){
const err219 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "contrastChecked"},message:"must have required property '"+"contrastChecked"+"'"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
if(data71.zoomAndReflowChecked === undefined){
const err220 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "zoomAndReflowChecked"},message:"must have required property '"+"zoomAndReflowChecked"+"'"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
if(data71.reducedMotion === undefined){
const err221 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "reducedMotion"},message:"must have required property '"+"reducedMotion"+"'"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
if(data71.canvasAlternative === undefined){
const err222 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "canvasAlternative"},message:"must have required property '"+"canvasAlternative"+"'"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
if(data71.nonDragAlternative === undefined){
const err223 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "nonDragAlternative"},message:"must have required property '"+"nonDragAlternative"+"'"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
if(data71.targetSizeChecked === undefined){
const err224 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "targetSizeChecked"},message:"must have required property '"+"targetSizeChecked"+"'"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
if(data71.errorsAnnounced === undefined){
const err225 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/required",keyword:"required",params:{missingProperty: "errorsAnnounced"},message:"must have required property '"+"errorsAnnounced"+"'"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
for(const key12 in data71){
if(!(func3.call(schema111.properties, key12))){
const err226 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
}
if(data71.target !== undefined){
if("WCAG 2.2 AA" !== data71.target){
const err227 = {instancePath:instancePath+"/accessibility/target",schemaPath:"#/$defs/accessibility/properties/target/const",keyword:"const",params:{allowedValue: "WCAG 2.2 AA"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
}
if(data71.semanticDom !== undefined){
if(typeof data71.semanticDom !== "boolean"){
const err228 = {instancePath:instancePath+"/accessibility/semanticDom",schemaPath:"#/$defs/accessibility/properties/semanticDom/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
}
if(data71.keyboardComplete !== undefined){
if(typeof data71.keyboardComplete !== "boolean"){
const err229 = {instancePath:instancePath+"/accessibility/keyboardComplete",schemaPath:"#/$defs/accessibility/properties/keyboardComplete/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
}
if(data71.visibleFocus !== undefined){
if(typeof data71.visibleFocus !== "boolean"){
const err230 = {instancePath:instancePath+"/accessibility/visibleFocus",schemaPath:"#/$defs/accessibility/properties/visibleFocus/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
}
if(data71.contrastChecked !== undefined){
if(typeof data71.contrastChecked !== "boolean"){
const err231 = {instancePath:instancePath+"/accessibility/contrastChecked",schemaPath:"#/$defs/accessibility/properties/contrastChecked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
}
if(data71.zoomAndReflowChecked !== undefined){
if(typeof data71.zoomAndReflowChecked !== "boolean"){
const err232 = {instancePath:instancePath+"/accessibility/zoomAndReflowChecked",schemaPath:"#/$defs/accessibility/properties/zoomAndReflowChecked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
}
if(data71.reducedMotion !== undefined){
if(typeof data71.reducedMotion !== "boolean"){
const err233 = {instancePath:instancePath+"/accessibility/reducedMotion",schemaPath:"#/$defs/accessibility/properties/reducedMotion/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
}
if(data71.canvasAlternative !== undefined){
if(typeof data71.canvasAlternative !== "boolean"){
const err234 = {instancePath:instancePath+"/accessibility/canvasAlternative",schemaPath:"#/$defs/accessibility/properties/canvasAlternative/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
}
if(data71.nonDragAlternative !== undefined){
if(typeof data71.nonDragAlternative !== "boolean"){
const err235 = {instancePath:instancePath+"/accessibility/nonDragAlternative",schemaPath:"#/$defs/accessibility/properties/nonDragAlternative/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
}
if(data71.targetSizeChecked !== undefined){
if(typeof data71.targetSizeChecked !== "boolean"){
const err236 = {instancePath:instancePath+"/accessibility/targetSizeChecked",schemaPath:"#/$defs/accessibility/properties/targetSizeChecked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
if(data71.errorsAnnounced !== undefined){
if(typeof data71.errorsAnnounced !== "boolean"){
const err237 = {instancePath:instancePath+"/accessibility/errorsAnnounced",schemaPath:"#/$defs/accessibility/properties/errorsAnnounced/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
}
}
else {
const err238 = {instancePath:instancePath+"/accessibility",schemaPath:"#/$defs/accessibility/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
if(data.performanceBudget !== undefined){
let data83 = data.performanceBudget;
if(data83 && typeof data83 == "object" && !Array.isArray(data83)){
if(data83.initialJsKbGzip === undefined){
const err239 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "initialJsKbGzip"},message:"must have required property '"+"initialJsKbGzip"+"'"};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
if(data83.routeJsKbGzip === undefined){
const err240 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "routeJsKbGzip"},message:"must have required property '"+"routeJsKbGzip"+"'"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
if(data83.mediaMbDesktop === undefined){
const err241 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "mediaMbDesktop"},message:"must have required property '"+"mediaMbDesktop"+"'"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
if(data83.mediaMbMobile === undefined){
const err242 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "mediaMbMobile"},message:"must have required property '"+"mediaMbMobile"+"'"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
if(data83.maxDprDesktop === undefined){
const err243 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "maxDprDesktop"},message:"must have required property '"+"maxDprDesktop"+"'"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
if(data83.maxDprMobile === undefined){
const err244 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "maxDprMobile"},message:"must have required property '"+"maxDprMobile"+"'"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
if(data83.maxDrawCalls === undefined){
const err245 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "maxDrawCalls"},message:"must have required property '"+"maxDrawCalls"+"'"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
if(data83.maxTriangles === undefined){
const err246 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "maxTriangles"},message:"must have required property '"+"maxTriangles"+"'"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
if(data83.lcpMs === undefined){
const err247 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "lcpMs"},message:"must have required property '"+"lcpMs"+"'"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
if(data83.cls === undefined){
const err248 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "cls"},message:"must have required property '"+"cls"+"'"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
if(data83.tbtMs === undefined){
const err249 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/required",keyword:"required",params:{missingProperty: "tbtMs"},message:"must have required property '"+"tbtMs"+"'"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
for(const key13 in data83){
if(!(func3.call(schema112.properties, key13))){
const err250 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
}
if(data83.initialJsKbGzip !== undefined){
let data84 = data83.initialJsKbGzip;
if((typeof data84 == "number") && (isFinite(data84))){
if(data84 > 250 || isNaN(data84)){
const err251 = {instancePath:instancePath+"/performanceBudget/initialJsKbGzip",schemaPath:"#/$defs/performance/properties/initialJsKbGzip/maximum",keyword:"maximum",params:{comparison: "<=", limit: 250},message:"must be <= 250"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
if(data84 < 0 || isNaN(data84)){
const err252 = {instancePath:instancePath+"/performanceBudget/initialJsKbGzip",schemaPath:"#/$defs/performance/properties/initialJsKbGzip/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
else {
const err253 = {instancePath:instancePath+"/performanceBudget/initialJsKbGzip",schemaPath:"#/$defs/performance/properties/initialJsKbGzip/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
if(data83.routeJsKbGzip !== undefined){
let data85 = data83.routeJsKbGzip;
if((typeof data85 == "number") && (isFinite(data85))){
if(data85 > 450 || isNaN(data85)){
const err254 = {instancePath:instancePath+"/performanceBudget/routeJsKbGzip",schemaPath:"#/$defs/performance/properties/routeJsKbGzip/maximum",keyword:"maximum",params:{comparison: "<=", limit: 450},message:"must be <= 450"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
if(data85 < 0 || isNaN(data85)){
const err255 = {instancePath:instancePath+"/performanceBudget/routeJsKbGzip",schemaPath:"#/$defs/performance/properties/routeJsKbGzip/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
}
else {
const err256 = {instancePath:instancePath+"/performanceBudget/routeJsKbGzip",schemaPath:"#/$defs/performance/properties/routeJsKbGzip/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
if(data83.mediaMbDesktop !== undefined){
let data86 = data83.mediaMbDesktop;
if((typeof data86 == "number") && (isFinite(data86))){
if(data86 > 6 || isNaN(data86)){
const err257 = {instancePath:instancePath+"/performanceBudget/mediaMbDesktop",schemaPath:"#/$defs/performance/properties/mediaMbDesktop/maximum",keyword:"maximum",params:{comparison: "<=", limit: 6},message:"must be <= 6"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
if(data86 < 0 || isNaN(data86)){
const err258 = {instancePath:instancePath+"/performanceBudget/mediaMbDesktop",schemaPath:"#/$defs/performance/properties/mediaMbDesktop/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
}
else {
const err259 = {instancePath:instancePath+"/performanceBudget/mediaMbDesktop",schemaPath:"#/$defs/performance/properties/mediaMbDesktop/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
}
if(data83.mediaMbMobile !== undefined){
let data87 = data83.mediaMbMobile;
if((typeof data87 == "number") && (isFinite(data87))){
if(data87 > 2 || isNaN(data87)){
const err260 = {instancePath:instancePath+"/performanceBudget/mediaMbMobile",schemaPath:"#/$defs/performance/properties/mediaMbMobile/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2},message:"must be <= 2"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
if(data87 < 0 || isNaN(data87)){
const err261 = {instancePath:instancePath+"/performanceBudget/mediaMbMobile",schemaPath:"#/$defs/performance/properties/mediaMbMobile/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
}
else {
const err262 = {instancePath:instancePath+"/performanceBudget/mediaMbMobile",schemaPath:"#/$defs/performance/properties/mediaMbMobile/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
}
if(data83.maxDprDesktop !== undefined){
let data88 = data83.maxDprDesktop;
if((typeof data88 == "number") && (isFinite(data88))){
if(data88 > 2 || isNaN(data88)){
const err263 = {instancePath:instancePath+"/performanceBudget/maxDprDesktop",schemaPath:"#/$defs/performance/properties/maxDprDesktop/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2},message:"must be <= 2"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
if(data88 < 0 || isNaN(data88)){
const err264 = {instancePath:instancePath+"/performanceBudget/maxDprDesktop",schemaPath:"#/$defs/performance/properties/maxDprDesktop/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
}
else {
const err265 = {instancePath:instancePath+"/performanceBudget/maxDprDesktop",schemaPath:"#/$defs/performance/properties/maxDprDesktop/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
}
if(data83.maxDprMobile !== undefined){
let data89 = data83.maxDprMobile;
if((typeof data89 == "number") && (isFinite(data89))){
if(data89 > 1.5 || isNaN(data89)){
const err266 = {instancePath:instancePath+"/performanceBudget/maxDprMobile",schemaPath:"#/$defs/performance/properties/maxDprMobile/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1.5},message:"must be <= 1.5"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
if(data89 < 0 || isNaN(data89)){
const err267 = {instancePath:instancePath+"/performanceBudget/maxDprMobile",schemaPath:"#/$defs/performance/properties/maxDprMobile/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
else {
const err268 = {instancePath:instancePath+"/performanceBudget/maxDprMobile",schemaPath:"#/$defs/performance/properties/maxDprMobile/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
}
if(data83.maxDrawCalls !== undefined){
let data90 = data83.maxDrawCalls;
if((typeof data90 == "number") && (isFinite(data90))){
if(data90 > 120 || isNaN(data90)){
const err269 = {instancePath:instancePath+"/performanceBudget/maxDrawCalls",schemaPath:"#/$defs/performance/properties/maxDrawCalls/maximum",keyword:"maximum",params:{comparison: "<=", limit: 120},message:"must be <= 120"};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
if(data90 < 0 || isNaN(data90)){
const err270 = {instancePath:instancePath+"/performanceBudget/maxDrawCalls",schemaPath:"#/$defs/performance/properties/maxDrawCalls/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
}
else {
const err271 = {instancePath:instancePath+"/performanceBudget/maxDrawCalls",schemaPath:"#/$defs/performance/properties/maxDrawCalls/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
}
if(data83.maxTriangles !== undefined){
let data91 = data83.maxTriangles;
if((typeof data91 == "number") && (isFinite(data91))){
if(data91 > 250000 || isNaN(data91)){
const err272 = {instancePath:instancePath+"/performanceBudget/maxTriangles",schemaPath:"#/$defs/performance/properties/maxTriangles/maximum",keyword:"maximum",params:{comparison: "<=", limit: 250000},message:"must be <= 250000"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
if(data91 < 0 || isNaN(data91)){
const err273 = {instancePath:instancePath+"/performanceBudget/maxTriangles",schemaPath:"#/$defs/performance/properties/maxTriangles/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
else {
const err274 = {instancePath:instancePath+"/performanceBudget/maxTriangles",schemaPath:"#/$defs/performance/properties/maxTriangles/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
}
if(data83.lcpMs !== undefined){
let data92 = data83.lcpMs;
if((typeof data92 == "number") && (isFinite(data92))){
if(data92 > 2500 || isNaN(data92)){
const err275 = {instancePath:instancePath+"/performanceBudget/lcpMs",schemaPath:"#/$defs/performance/properties/lcpMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2500},message:"must be <= 2500"};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
if(data92 < 0 || isNaN(data92)){
const err276 = {instancePath:instancePath+"/performanceBudget/lcpMs",schemaPath:"#/$defs/performance/properties/lcpMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
}
else {
const err277 = {instancePath:instancePath+"/performanceBudget/lcpMs",schemaPath:"#/$defs/performance/properties/lcpMs/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
}
if(data83.cls !== undefined){
let data93 = data83.cls;
if((typeof data93 == "number") && (isFinite(data93))){
if(data93 > 0.1 || isNaN(data93)){
const err278 = {instancePath:instancePath+"/performanceBudget/cls",schemaPath:"#/$defs/performance/properties/cls/maximum",keyword:"maximum",params:{comparison: "<=", limit: 0.1},message:"must be <= 0.1"};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
if(data93 < 0 || isNaN(data93)){
const err279 = {instancePath:instancePath+"/performanceBudget/cls",schemaPath:"#/$defs/performance/properties/cls/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
}
else {
const err280 = {instancePath:instancePath+"/performanceBudget/cls",schemaPath:"#/$defs/performance/properties/cls/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
if(data83.tbtMs !== undefined){
let data94 = data83.tbtMs;
if((typeof data94 == "number") && (isFinite(data94))){
if(data94 > 200 || isNaN(data94)){
const err281 = {instancePath:instancePath+"/performanceBudget/tbtMs",schemaPath:"#/$defs/performance/properties/tbtMs/maximum",keyword:"maximum",params:{comparison: "<=", limit: 200},message:"must be <= 200"};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
if(data94 < 0 || isNaN(data94)){
const err282 = {instancePath:instancePath+"/performanceBudget/tbtMs",schemaPath:"#/$defs/performance/properties/tbtMs/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
}
else {
const err283 = {instancePath:instancePath+"/performanceBudget/tbtMs",schemaPath:"#/$defs/performance/properties/tbtMs/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
}
}
else {
const err284 = {instancePath:instancePath+"/performanceBudget",schemaPath:"#/$defs/performance/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
}
if(data.claims !== undefined){
let data95 = data.claims;
if(Array.isArray(data95)){
const len4 = data95.length;
for(let i4=0; i4<len4; i4++){
if(!(validate21(data95[i4], {instancePath:instancePath+"/claims/" + i4,parentData:data95,parentDataProperty:i4,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
}
}
else {
const err285 = {instancePath:instancePath+"/claims",schemaPath:"#/properties/claims/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
}
if(data.assets !== undefined){
let data97 = data.assets;
if(Array.isArray(data97)){
if(data97.length < 1){
const err286 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
const len5 = data97.length;
for(let i5=0; i5<len5; i5++){
if(!(validate23(data97[i5], {instancePath:instancePath+"/assets/" + i5,parentData:data97,parentDataProperty:i5,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
}
else {
const err287 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
}
if(data.evidence !== undefined){
if(!(validate26(data.evidence, {instancePath:instancePath+"/evidence",parentData:data,parentDataProperty:"evidence",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
}
}
else {
const err288 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};
