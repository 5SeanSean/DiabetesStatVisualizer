"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGraph = renderGraph;
// src/displayData.ts
var SiteData_js_1 = require("./SiteData.js");
var auto_1 = require("chart.js/auto");
function renderGraph() {
    return __awaiter(this, void 0, void 0, function () {
        var allTablesData, tableData, canvas, ctx, labels, datasets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, SiteData_js_1.scrapeCDCDiabetesData)()];
                case 1:
                    allTablesData = _a.sent();
                    if (!allTablesData || allTablesData.length === 0) {
                        console.error('No data available to render graph.');
                        return [2 /*return*/];
                    }
                    tableData = allTablesData.length > 1 ? allTablesData[1] : allTablesData[0];
                    canvas = document.getElementById('cdc-diabetes-chart');
                    if (!canvas) {
                        console.error('Canvas element not found');
                        return [2 /*return*/];
                    }
                    ctx = canvas.getContext('2d');
                    if (!ctx) {
                        console.error('Failed to get canvas 2D context.');
                        return [2 /*return*/];
                    }
                    labels = tableData.data.map(function (row) { return row[tableData.headers[0]]; });
                    datasets = tableData.headers.slice(1).map(function (header, index) {
                        var data = tableData.data.map(function (row) {
                            var val = row[header];
                            // Handle both string values and already parsed numbers
                            var strVal = typeof val === 'string' ? val : String(val);
                            var num = Number(strVal.replace(/[^0-9.-]+/g, '')); // Remove non-numeric chars
                            return isNaN(num) ? 0 : num;
                        });
                        // Generate colors for each dataset
                        var colorHue = (index * 60) % 360;
                        var backgroundColor = "hsla(".concat(colorHue, ", 70%, 70%, 0.4)");
                        var borderColor = "hsl(".concat(colorHue, ", 70%, 50%)");
                        return {
                            label: header,
                            data: data,
                            fill: false,
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            borderWidth: 2,
                            tension: 0.1,
                        };
                    });
                    // Create the Chart.js line chart
                    new auto_1.default(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: datasets,
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: tableData.caption || 'CDC Diabetes Data',
                                    font: {
                                        size: 18,
                                    },
                                },
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    mode: 'nearest',
                                    intersect: false,
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: tableData.headers[0],
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Percentage (95% CI)',
                                    },
                                    beginAtZero: true,
                                },
                            },
                        },
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Run the renderGraph function on page load
window.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, rendering graph...');
    renderGraph().catch(function (error) {
        console.error('Error rendering graph:', error);
    });
});
