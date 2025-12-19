// ==UserScript==
// @name         Ultra Anti-Debug Bypass Pro v16.0 - Enhanced Edition
// @namespace    http://tampermonkey.net/
// @version      16.0
// @description  Enhanced M3U8/HLS/DASH download, advanced player, modern UI, smart caching, parallel downloads, improved anti-debug
// @author       Security Research Team
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @run-at       document-start
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.6.13/hls.min.js
// @require      https://cdn.dashjs.org/latest/dash.all.min.js
// ==/UserScript==

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██████╗  ██████╗ ███╗   ██╗███████╗██╗ ██████╗ ██╗   ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    // ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    // ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗██║   ██║██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║
    // ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║██║   ██║██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    // ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    //  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    // ═══════════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        version: '16.0',
        codename: 'Enhanced',
        enabled: true,
        debug: false,
        hotkeys: {
            togglePanel: 'u',      // Alt+U
            forceScan: 's',        // Alt+S
            downloadBest: 'd',     // Alt+D
            togglePlayer: 'p',     // Alt+P
            screenshot: 'c',       // Alt+C
            toggleMinimize: 'm',   // Alt+M (NEW)
            focusSearch: 'f'       // Alt+F (NEW)
        },
        storage: {
            prefix: 'uadbp_v16_',
            maxAge: 86400000,       // 24h cache expiry (NEW)
            autoSave: false          // (FIX) Auto-save off by default
        },
        ui: {
            theme: 'dark',          // 'dark', 'light', 'auto'
            position: { top: 10, left: 10 },
            compactMode: false,
            animations: true,
            glassmorphism: true,
            showNotifications: true, // (NEW) Desktop notifications
            persistPosition: true    // (NEW) Remember panel position
        },
        features: {
            // Anti-Debug Suite
            debuggerBypass: true,
            devToolsProtection: true,
            consoleProtection: true,
            sourceProtection: true,
            timingProtection: true,
            fullscreenBypass: true,  // (v14 Parity) Prevent forced fullscreen
            antiVM: true,            // (NEW) Anti-VM detection bypass

            // Capture Features
            networkIntercept: true,
            blobCapture: true,
            headerCapture: true,
            crossFrameCapture: true,
            autoScan: true,
            deepScan: true,
            autoClear: true,         // (NEW) Auto clear on navigation
            webSocketCapture: true,  // (NEW) WebSocket interception

            // Download Features
            hlsDownload: true,
            dashDownload: true,
            proxyDownload: true,
            downloadQueue: true,
            pauseResume: true,
            parallelDownload: true,  // (NEW) Multi-segment parallel
            autoMerge: true,         // (NEW) Auto-merge segments

            // Player Features
            advancedPlayer: true,
            pictureInPicture: true,
            playbackSpeed: true,
            videoFilters: true,
            gestureControls: true,
            subtitleSupport: true,   // (NEW) Subtitle loading
            audioBoost: true,        // (NEW) Volume boost

            // Extra Features
            subtitleCapture: true,
            audioTrackSelect: true,
            thumbnailPreview: true,
            networkMonitor: true,
            bandwidthTest: true,
            autoRetry: true,         // (NEW) Auto-retry failed
            smartQuality: true       // (NEW) Auto quality selection
        },
        download: {
            maxConcurrent: 8,        // Increased from 6
            retryAttempts: 5,
            retryDelay: 1000,
            chunkSize: 2 * 1024 * 1024, // 2MB chunks (increased)
            timeout: 90000,          // 90s timeout (increased)
            minSpeed: 10000,         // (NEW) Min 10KB/s or retry
            bufferSize: 10           // (NEW) Segments to buffer ahead
        },
        proxy: {
            servers: [
                'https://corsproxy.io/?',
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/',
                'https://api.codetabs.com/v1/proxy?quest=' // (NEW)
            ],
            currentIndex: 0,
            autoRotate: true,
            healthCheck: true,       // (NEW) Test proxy health
            failoverDelay: 500       // (NEW) ms before failover
        },
        player: {
            defaultVolume: 1.0,
            defaultSpeed: 1.0,
            speeds: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4], // Added 4x
            rememberPosition: true,
            autoplay: true,
            maxVolume: 4.0,          // (NEW) 400% volume boost
            seekStep: 5,             // (NEW) Arrow key seek seconds
            volumeStep: 0.1          // (NEW) Arrow key volume step
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // ███████╗████████╗ █████╗ ████████╗███████╗
    // ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
    // ███████╗   ██║   ███████║   ██║   █████╗  
    // ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  
    // ███████║   ██║   ██║  ██║   ██║   ███████╗
    // ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
    // ═══════════════════════════════════════════════════════════════════════════════

    const STATE = {
        isMainFrame: (window.top === window.self),
        initialized: false,
        mediaUrls: new Map(),
        capturedHeaders: new Map(),
        downloadQueue: [],
        activeDownloads: new Map(),
        networkStats: {
            requests: 0,
            mediaRequests: 0,
            bytesIn: 0,
            bytesOut: 0,
            startTime: Date.now(),   // (NEW) Session start
            peakSpeed: 0             // (NEW) Peak download speed
        },
        playerState: {
            url: null,
            position: 0,
            volume: 1,
            speed: 1,
            subtitle: null,          // (NEW) Current subtitle
            quality: -1              // (NEW) Current quality level
        },
        proxyHealth: new Map(),      // (NEW) Proxy health tracking
        webSockets: new Set(),       // (NEW) Tracked WebSockets
        sessionId: Math.random().toString(36).substr(2, 9) // (NEW)
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██╗   ██╗████████╗██╗██╗     ██╗████████╗██╗███████╗███████╗
    // ██║   ██║╚══██╔══╝██║██║     ██║╚══██╔══╝██║██╔════╝██╔════╝
    // ██║   ██║   ██║   ██║██║     ██║   ██║   ██║█████╗  ███████╗
    // ██║   ██║   ██║   ██║██║     ██║   ██║   ██║██╔══╝  ╚════██║
    // ╚██████╔╝   ██║   ██║███████╗██║   ██║   ██║███████╗███████║
    //  ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝
    // ═══════════════════════════════════════════════════════════════════════════════

    const Utils = {
        generateId: () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36),

        formatBytes: (bytes) => {
            if (!bytes || bytes === 0) return '0 B';
            const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        formatTime: (ms) => new Date(ms).toLocaleTimeString(),

        formatDuration: (seconds) => {
            if (!seconds || isNaN(seconds)) return '0:00';
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                : `${m}:${s.toString().padStart(2, '0')}`;
        },

        formatETA: (seconds) => {
            if (!seconds || seconds === Infinity) return '--:--';
            return Utils.formatDuration(seconds);
        },

        sleep: (ms) => new Promise(r => setTimeout(r, ms)),

        safeCall: (fn, fallback = null) => {
            try { return fn(); } catch (e) { return fallback; }
        },

        debounce: (fn, delay) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => fn(...args), delay);
            };
        },

        throttle: (fn, limit) => {
            let inThrottle;
            return (...args) => {
                if (!inThrottle) {
                    fn(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        resolveUrl: (base, relative) => {
            try {
                if (relative.startsWith('http')) return relative;
                if (relative.startsWith('//')) return window.location.protocol + relative;
                return new URL(relative, base).href;
            } catch (e) {
                const baseDir = base.substring(0, base.lastIndexOf('/') + 1);
                return baseDir + relative;
            }
        },

        extractDomain: (url) => {
            try { return new URL(url).hostname; } catch (e) { return 'unknown'; }
        },

        hashCode: (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(36);
        },

        clamp: (val, min, max) => Math.min(Math.max(val, min), max),

        // ===== NEW v16.0 UTILITY FUNCTIONS =====

        // UUID v4 generator
        uuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        }),
        generateId: () => Utils.uuid(), // Alias for generateId calls

        // Format relative time (Just now, 5m ago, 2h ago)
        formatRelative: (ms) => {
            const diff = Date.now() - ms;
            if (diff < 60000) return 'Just now';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
            return `${Math.floor(diff / 86400000)}d ago`;
        },

        // Format speed (bytes/sec to human readable)
        formatSpeed: (bytesPerSec) => Utils.formatBytes(bytesPerSec) + '/s',

        // Extract filename from URL
        extractFilename: (url, defaultName = 'video') => {
            try {
                const path = new URL(url).pathname;
                const name = path.split('/').pop().split('?')[0];
                return name || defaultName;
            } catch { return defaultName; }
        },

        // Deep clone object
        deepClone: (obj) => JSON.parse(JSON.stringify(obj)),

        // Escape HTML entities
        escapeHtml: (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // Safe async call with fallback
        safeAsync: async (fn, fallback = null) => {
            try { return await fn(); } catch (e) { return fallback; }
        },

        // Copy to clipboard with multiple fallbacks
        copyText: async (text) => {
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                return true;
            }
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;left:-9999px';
                document.body.appendChild(ta);
                ta.select();
                const success = document.execCommand('copy');
                document.body.removeChild(ta);
                return success;
            }
        },

        // Show desktop notification
        notify: (message, type = 'info') => {
            if (!CONFIG.ui.showNotifications) return;
            if (typeof GM_notification !== 'undefined') {
                GM_notification({ title: `UADBP v${CONFIG.version}`, text: message, timeout: 3000 });
            }
        },

        // Parse URL query string to object
        parseQuery: (url) => {
            try { return Object.fromEntries(new URL(url).searchParams); }
            catch { return {}; }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // ███████╗██╗   ██╗███████╗███╗   ██╗████████╗    ███████╗███╗   ███╗██╗████████╗████████╗███████╗██████╗ 
    // ██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝████╗ ████║██║╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
    // █████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║       █████╗  ██╔████╔██║██║   ██║      ██║   █████╗  ██████╔╝
    // ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║       ██╔══╝  ██║╚██╔╝██║██║   ██║      ██║   ██╔══╝  ██╔══██╗
    // ███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║       ███████╗██║ ╚═╝ ██║██║   ██║      ██║   ███████╗██║  ██║
    // ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚══════╝╚═╝     ╚═╝╚═╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class EventEmitter {
        constructor() {
            this.events = new Map();
            this.onceEvents = new Set();     // (NEW) Track once listeners
            this.maxListeners = 100;         // (NEW) Memory protection
        }

        on(event, callback, priority = 0) {
            if (!this.events.has(event)) this.events.set(event, []);
            const listeners = this.events.get(event);

            // (NEW) Priority-based insertion
            const entry = { callback, priority };
            const idx = listeners.findIndex(l => l.priority < priority);
            if (idx === -1) listeners.push(entry);
            else listeners.splice(idx, 0, entry);

            // Memory protection
            if (listeners.length > this.maxListeners) {
                console.warn(`EventEmitter: Max listeners (${this.maxListeners}) exceeded for "${event}"`);
            }

            return () => this.off(event, callback);
        }

        off(event, callback) {
            const listeners = this.events.get(event);
            if (listeners) {
                const idx = listeners.findIndex(l => l.callback === callback);
                if (idx > -1) listeners.splice(idx, 1);
                if (listeners.length === 0) this.events.delete(event);
            }
        }

        emit(event, ...args) {
            const listeners = this.events.get(event);
            if (listeners) {
                // Create copy to avoid mutation during iteration
                [...listeners].forEach(({ callback }) => {
                    try { callback(...args); }
                    catch (e) { console.error(`Event "${event}" error:`, e); }
                });
            }

            // (NEW) Wildcard support - emit to '*' listeners
            if (event !== '*') {
                const wildcardListeners = this.events.get('*');
                if (wildcardListeners) {
                    [...wildcardListeners].forEach(({ callback }) => {
                        try { callback(event, ...args); }
                        catch (e) { console.error('Wildcard event error:', e); }
                    });
                }
            }
        }

        once(event, callback) {
            const wrapper = (...args) => {
                this.off(event, wrapper);
                callback(...args);
            };
            this.onceEvents.add(wrapper);
            this.on(event, wrapper);
        }

        // (NEW) Remove all listeners for an event
        removeAllListeners(event) {
            if (event) this.events.delete(event);
            else this.events.clear();
        }

        // (NEW) Get listener count
        listenerCount(event) {
            return this.events.get(event)?.length || 0;
        }

        // (NEW) Emit async (waits for all handlers)
        async emitAsync(event, ...args) {
            const listeners = this.events.get(event);
            if (listeners) {
                await Promise.all(listeners.map(async ({ callback }) => {
                    try { await callback(...args); }
                    catch (e) { console.error(`Async event "${event}" error:`, e); }
                }));
            }
        }
    }

    // Global event bus
    const Events = new EventEmitter();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██╗      ██████╗  ██████╗  ██████╗ ███████╗██████╗     ██╗   ██╗ ██╗ ██████╗ 
    // ██║     ██╔═══██╗██╔════╝ ██╔════╝ ██╔════╝██╔══██╗    ██║   ██║███║██╔════╝ 
    // ██║     ██║   ██║██║  ███╗██║  ███╗█████╗  ██████╔╝    ██║   ██║╚██║███████╗ 
    // ██║     ██║   ██║██║   ██║██║   ██║██╔══╝  ██╔══██╗    ╚██╗ ██╔╝ ██║██╔═══██╗
    // ███████╗╚██████╔╝╚██████╔╝╚██████╔╝███████╗██║  ██║     ╚████╔╝  ██║╚██████╔╝
    // ╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝      ╚═══╝   ╚═╝ ╚═════╝ 
    // ═══════════════════════════════════════════════════════════════════════════════

    class Logger {
        constructor() {
            this.history = [];
            this.stats = {
                captures: 0,
                bypasses: 0,
                downloads: 0,
                errors: 0,
                blocked: 0,
                requests: 0,        // (NEW)
                warnings: 0         // (NEW)
            };
            this.maxHistory = 1000;
            this.groups = new Map();    // (NEW) Grouped logs
            this.filters = new Set();   // (NEW) Active filters
            this.paused = false;        // (NEW) Pause logging
        }

        log(message, level = 'info', data = null) {
            if (this.paused) return;

            const entry = {
                id: Utils.generateId(),
                message,
                level,
                data,
                time: Date.now(),
                frame: STATE.isMainFrame ? 'main' : 'iframe',
                stack: CONFIG.debug ? new Error().stack : null  // (NEW) Debug stack
            };

            this.history.unshift(entry);
            if (this.history.length > this.maxHistory) this.history.pop();

            // Update stats based on level
            if (level === 'error') this.stats.errors++;
            if (level === 'warning') this.stats.warnings++;

            if (CONFIG.debug || level === 'error' || level === 'success') {
                const styles = {
                    info: 'color:#00d4ff;font-weight:normal',
                    success: 'color:#00ff88;font-weight:bold',
                    warning: 'color:#ffaa00;font-weight:bold',
                    error: 'color:#ff4444;font-weight:bold',
                    bypass: 'color:#ff00ff;font-weight:bold',
                    capture: 'color:#00ffaa;font-weight:bold',
                    download: 'color:#88aaff;font-weight:bold',  // (NEW)
                    network: 'color:#aaaaff;font-weight:normal'  // (NEW)
                };
                console.log(`%c🛡️ [UADBP v${CONFIG.version}] ${message}`, styles[level] || styles.info);
                if (data && CONFIG.debug) console.log('  └─ Data:', data);
            }

            if (CONFIG.ui.showNotifications && (level === 'success' || level === 'error') && typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: `UADBP ${level === 'error' ? 'Error' : 'Success'}`,
                    text: message,
                    image: 'https://i.imgur.com/G5g25E5.png', // Optional icon
                    timeout: 4000
                });
            }

            Events.emit('log', entry);
            Events.emit('stats-update', this.stats);
        }

        // (NEW) Structured logging methods
        info(message, data) { this.log(message, 'info', data); }
        success(message, data) { this.log(message, 'success', data); }
        warn(message, data) { this.log(message, 'warning', data); this.stats.warnings++; }
        error(message, data) { this.log(message, 'error', data); }
        debug(message, data) { if (CONFIG.debug) this.log(message, 'info', data); }

        incrementStat(stat, amount = 1) {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] += amount;
                Events.emit('stats-update', this.stats);
            }
        }

        getStats() { return { ...this.stats }; }
        getHistory(limit = 50) { return this.history.slice(0, limit); }

        clear() {
            this.history = [];
            Events.emit('log-cleared');
        }

        // (NEW) Filter history by level
        getByLevel(level) {
            return this.history.filter(e => e.level === level);
        }

        // (NEW) Search history
        search(query) {
            const q = query.toLowerCase();
            return this.history.filter(e => e.message.toLowerCase().includes(q));
        }

        // (NEW) Export logs
        export(format = 'json') {
            if (format === 'json') return JSON.stringify(this.history, null, 2);
            if (format === 'text') return this.history.map(e =>
                `[${new Date(e.time).toISOString()}] [${e.level.toUpperCase()}] ${e.message}`
            ).join('\n');
            return '';
        }

        // (NEW) Pause/Resume
        pause() { this.paused = true; }
        resume() { this.paused = false; }

        // (NEW) Time a function
        async time(label, fn) {
            const start = performance.now();
            try {
                const result = await fn();
                this.log(`${label}: ${(performance.now() - start).toFixed(2)}ms`, 'info');
                return result;
            } catch (e) {
                this.error(`${label} failed: ${e.message}`);
                throw e;
            }
        }
    }

    const logger = new Logger();

    // ═══════════════════════════════════════════════════════════════════════════════
    //  █████╗ ███╗   ██╗████████╗██╗    ██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗ 
    // ██╔══██╗████╗  ██║╚══██╔══╝██║    ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝ 
    // ███████║██╔██╗ ██║   ██║   ██║    ██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗
    // ██╔══██║██║╚██╗██║   ██║   ██║    ██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║
    // ██║  ██║██║ ╚████║   ██║   ██║    ██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝
    // ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝    ╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝ 
    // ═══════════════════════════════════════════════════════════════════════════════

    class AntiDebugBypass {
        constructor() {
            this.bypassed = {
                debugger: 0,
                devtools: 0,
                console: 0,
                timing: 0,
                source: 0,
                vm: 0,              // (NEW)
                worker: 0           // (NEW)
            };
        }

        enable() {
            if (CONFIG.features.debuggerBypass) this.bypassDebugger();
            if (CONFIG.features.devToolsProtection) this.bypassDevToolsDetection();
            if (CONFIG.features.consoleProtection) this.protectConsole();
            if (CONFIG.features.timingProtection) this.bypassTimingChecks();
            if (CONFIG.features.sourceProtection) this.bypassSourceProtection();
            if (CONFIG.features.antiVM) this.bypassVM();  // (NEW)

            this.bypassFullscreen();
            this.bypassContextMenu();
            this.bypassKeyboardBlocking();
            this.bypassClipboardBlocking();
            this.bypassWorker(); // (NEW)
            this.interceptEME(); // (NEW)

            logger.log(`🛡️ Anti-Debug Suite Enabled (${Object.values(this.bypassed).reduce((a, b) => a + b, 0)} protections)`, 'bypass');
        }

        bypassDebugger() {
            // Method 1: Override eval
            const origEval = window.eval;
            window.eval = function (code) {
                if (typeof code === 'string') {
                    code = code.replace(/\bdebugger\b\s*;?/g, '/* UADBP */');
                }
                return origEval.call(this, code);
            };

            // Method 2: Override Function constructor
            const OrigFunction = window.Function;
            window.Function = new Proxy(OrigFunction, {
                construct(target, args) {
                    if (args.length > 0) {
                        const lastIdx = args.length - 1;
                        if (typeof args[lastIdx] === 'string') {
                            args[lastIdx] = args[lastIdx].replace(/\bdebugger\b\s*;?/g, '/* UADBP */');
                        }
                    }
                    return Reflect.construct(target, args);
                },
                apply(target, thisArg, args) {
                    if (args.length > 0) {
                        const lastIdx = args.length - 1;
                        if (typeof args[lastIdx] === 'string') {
                            args[lastIdx] = args[lastIdx].replace(/\bdebugger\b\s*;?/g, '/* UADBP */');
                        }
                    }
                    return Reflect.apply(target, thisArg, args);
                }
            });

            // Method 3: Block setInterval/setTimeout debugger traps
            const origSetInterval = window.setInterval;
            const origSetTimeout = window.setTimeout;

            const wrapTimer = (orig) => function (fn, delay, ...args) {
                if (typeof fn === 'function') {
                    const fnStr = fn.toString();
                    if (fnStr.includes('debugger') || fnStr.includes('constructor') && fnStr.includes('apply')) {
                        logger.incrementStat('bypasses');
                        return 0;
                    }
                }
                if (typeof fn === 'string' && fn.includes('debugger')) {
                    logger.incrementStat('bypasses');
                    return 0;
                }
                return orig.call(this, fn, delay, ...args);
            };

            window.setInterval = wrapTimer(origSetInterval);
            window.setTimeout = wrapTimer(origSetTimeout);

            this.bypassed.debugger++;
            logger.log('Debugger statements bypassed', 'bypass');
        }

        bypassDevToolsDetection() {
            // Block common DevTools detection methods

            // Method 1: Override console.log timing detection
            const origLog = console.log;
            const origClear = console.clear;

            Object.defineProperty(console, 'log', {
                get: () => origLog,
                set: () => { }
            });

            // Method 2: Fake window dimensions (common detection method)
            const originalOuterWidth = Object.getOwnPropertyDescriptor(window, 'outerWidth');
            const originalOuterHeight = Object.getOwnPropertyDescriptor(window, 'outerHeight');

            Object.defineProperty(window, 'outerWidth', {
                get: () => window.innerWidth
            });
            Object.defineProperty(window, 'outerHeight', {
                get: () => window.innerHeight + 100
            });

            // Method 3: Block Firebug detection
            try {
                if (!window.Firebug) {
                    Object.defineProperty(window, 'Firebug', {
                        get: () => undefined,
                        set: () => { }
                    });
                }
            } catch (e) { }

            // Method 4: Block __REACT_DEVTOOLS_GLOBAL_HOOK__ checks
            try {
                if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
                        get: () => undefined,
                        set: () => { }
                    });
                }
            } catch (e) { }

            // Method 5: Override toString to hide function modifications
            const nativeToString = Function.prototype.toString;
            Function.prototype.toString = function () {
                if (this === window.setInterval || this === window.setTimeout ||
                    this === window.eval || this === window.Function) {
                    return nativeToString.call(eval);  // Return native-looking string
                }
                return nativeToString.call(this);
            };

            this.bypassed.devtools++;
            logger.log('DevTools detection bypassed', 'bypass');
        }

        protectConsole() {
            // Silence debug spam but keep errors
            const silentMethods = ['debug', 'trace', 'profile', 'profileEnd', 'count', 'countReset', 'time', 'timeEnd', 'timeLog'];

            silentMethods.forEach(method => {
                try {
                    const orig = console[method];
                    console[method] = function (...args) {
                        // Check if it's anti-debug spam
                        const str = args.join(' ');
                        if (str.includes('DevTools') || str.includes('debugger') || str.includes('detected')) {
                            return;
                        }
                        return orig.apply(console, args);
                    };
                } catch (e) { }
            });

            // Prevent console.clear
            console.clear = () => { };

            this.bypassed.console++;
            logger.log('Console protected', 'bypass');
        }

        bypassTimingChecks() {
            // Some sites use Date.now() or performance.now() to detect debugging
            const startTime = Date.now();
            const origDateNow = Date.now;
            const origPerfNow = performance.now.bind(performance);

            // Keep timing consistent to avoid detection
            let offset = 0;

            Date.now = function () {
                const real = origDateNow();
                return real - offset;
            };

            // Intercept pauses by monitoring large time gaps
            setInterval(() => {
                const expected = origDateNow() - startTime;
                const actual = Date.now() - startTime;
                if (expected - actual > 1000) {
                    offset += (expected - actual - 100);
                }
            }, 500);

            this.bypassed.timing++;
            logger.log('Timing checks bypassed', 'bypass');
        }

        bypassSourceProtection() {
            // Allow viewing source even if blocked
            document.addEventListener('keydown', (e) => {
                // Ctrl+U for view source
                if (e.ctrlKey && e.key === 'u') {
                    e.stopImmediatePropagation();
                }
                // F12 for DevTools
                if (e.key === 'F12') {
                    e.stopImmediatePropagation();
                }
                // Ctrl+Shift+I for DevTools
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.stopImmediatePropagation();
                }
                // Ctrl+Shift+J for Console
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                    e.stopImmediatePropagation();
                }
                // Ctrl+Shift+C for Element picker
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.stopImmediatePropagation();
                }
            }, true);

            this.bypassed.source++;
            logger.log('Source protection bypassed', 'bypass');
        }

        bypassFullscreen() {
            // Save native method for our player
            if (!Utils.nativeRequestFullscreen) {
                Utils.nativeRequestFullscreen = Element.prototype.requestFullscreen ||
                    Element.prototype.webkitRequestFullscreen ||
                    Element.prototype.mozRequestFullScreen ||
                    Element.prototype.msRequestFullscreen;
            }

            if (!CONFIG.features.fullscreenBypass) {
                // Restore native if disabled
                if (Utils.nativeRequestFullscreen) {
                    ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'].forEach(method => {
                        if (Element.prototype[method]) Element.prototype[method] = Utils.nativeRequestFullscreen;
                    });
                }
                return;
            }

            const noop = function () {
                logger.incrementStat('bypasses');
                return Promise.resolve();
            };

            ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'].forEach(method => {
                if (Element.prototype[method]) {
                    Element.prototype[method] = noop;
                }
            });
        }

        bypassContextMenu() {
            document.addEventListener('contextmenu', (e) => {
                e.stopImmediatePropagation();
            }, true);
        }

        bypassKeyboardBlocking() {
            const blockedKeys = ['F12', 'F5', 'Escape'];
            document.addEventListener('keydown', (e) => {
                if (blockedKeys.includes(e.key) || (e.ctrlKey && ['s', 'u', 'p'].includes(e.key.toLowerCase()))) {
                    e.stopImmediatePropagation();
                }
            }, true);
        }

        bypassClipboardBlocking() {
            ['copy', 'cut', 'paste', 'selectstart'].forEach(evt => {
                document.addEventListener(evt, (e) => {
                    e.stopImmediatePropagation();
                }, true);
            });
        }

        // (NEW) VM/Sandbox detection bypass
        bypassVM() {
            try {
                // Spoof plugins
                Object.defineProperty(navigator, 'plugins', {
                    get: () => {
                        const PDF = { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' };
                        return [PDF, PDF, PDF];
                    }
                });
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en', 'es']
                });
                Object.defineProperty(navigator, 'hardwareConcurrency', {
                    get: () => 8
                });
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false
                });
                this.bypassed.vm++;
                logger.log('VM/Sandbox detection bypassed', 'bypass');
            } catch (e) {
                logger.log('VM bypass error: ' + e.message, 'warning');
            }
        }

        // (NEW) Worker protection
        bypassWorker() {
            try {
                const origWorker = window.Worker;
                window.Worker = new Proxy(origWorker, {
                    construct(target, args) {
                        return Reflect.construct(target, args);
                    }
                });
                this.bypassed.worker++;
            } catch (e) { }
        }

        getStats() {
            return { ...this.bypassed };
        }

        // (NEW) DRM/EME Interception
        interceptEME() {
            if (!navigator.requestMediaKeySystemAccess) return;
            const self = this;
            const orig = navigator.requestMediaKeySystemAccess;
            navigator.requestMediaKeySystemAccess = async function (keySystem, supportedConfigurations) {
                logger.log(`DRM Content Detected: ${keySystem}`, 'warning');
                if (CONFIG.features.showNotifications) {
                    // Debounce notification
                    if (!self._lastNotif || Date.now() - self._lastNotif > 5000) {
                        Utils.notify(`DRM Detected: ${keySystem}`, 'Protected Content');
                        self._lastNotif = Date.now();
                    }
                }
                return orig.call(navigator, keySystem, supportedConfigurations);
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██╗  ██╗███████╗ █████╗ ██████╗ ███████╗██████╗ ███████╗
    // ██║  ██║██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
    // ███████║█████╗  ███████║██║  ██║█████╗  ██████╔╝███████╗
    // ██╔══██║██╔══╝  ██╔══██║██║  ██║██╔══╝  ██╔══██╗╚════██║
    // ██║  ██║███████╗██║  ██║██████╔╝███████╗██║  ██║███████║
    // ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class HeaderManager {
        constructor() {
            this.capturedHeaders = new Map();
            this.defaultHeaders = this.buildDefaultHeaders();
        }

        buildDefaultHeaders() {
            return {
                'Referer': Utils.safeCall(() => window.location.href, ''),
                'Origin': Utils.safeCall(() => window.location.origin, ''),
                'User-Agent': Utils.safeCall(() => navigator.userAgent, ''),
                'Accept': '*/*',
                'Accept-Language': Utils.safeCall(() => navigator.language, 'en-US'),
                'Cookie': Utils.safeCall(() => document.cookie, '')
            };
        }

        capture(url, extraHeaders = {}) {
            const headers = {
                ...this.defaultHeaders,
                ...extraHeaders,
                capturedAt: Date.now(),
                pageUrl: window.location.href
            };
            this.capturedHeaders.set(url, headers);
            STATE.capturedHeaders.set(url, headers);
        }

        get(url) {
            return this.capturedHeaders.get(url) || STATE.capturedHeaders.get(url) || this.defaultHeaders;
        }

        getAll() {
            return this.defaultHeaders;
        }

        generateCurl(url) {
            const h = this.get(url);
            let cmd = `curl -L -o "video_${Date.now()}.ts"`;
            Object.entries(h).forEach(([key, val]) => {
                if (val && typeof val === 'string' && !['capturedAt', 'pageUrl'].includes(key)) {
                    cmd += ` \\\n  -H "${key}: ${val}"`;
                }
            });
            cmd += ` \\\n  "${url}"`;
            return cmd;
        }

        generateFFmpeg(url) {
            const h = this.get(url);
            let headers = '';
            ['Referer', 'Origin', 'Cookie', 'User-Agent'].forEach(key => {
                if (h[key]) headers += `${key}: ${h[key]}\\r\\n`;
            });
            return `ffmpeg -headers "${headers}" \\\n  -i "${url}" \\\n  -c copy -bsf:a aac_adtstoasc \\\n  "video_${Date.now()}.mp4"`;
        }

        generateYtDlp(url) {
            const h = this.get(url);
            let cmd = 'yt-dlp';
            if (h.Referer) cmd += ` --referer "${h.Referer}"`;
            if (h.Cookie) cmd += ` --cookies-from-browser chrome`;
            cmd += ` --user-agent "${h['User-Agent']}"`;
            cmd += ` -o "%(title)s.%(ext)s"`;
            cmd += ` "${url}"`;
            return cmd;
        }

        generateN_m3u8DL(url) {
            const h = this.get(url);
            let cmd = `N_m3u8DL-RE "${url}"`;
            cmd += ` --save-name "video_${Date.now()}"`;
            ['Referer', 'Origin', 'Cookie'].forEach(key => {
                if (h[key]) cmd += ` -H "${key}: ${h[key]}"`;
            });
            return cmd;
        }

        generateAria2(url) {
            const h = this.get(url);
            let cmd = `aria2c -x 16 -s 16`;
            if (h.Referer) cmd += ` --referer="${h.Referer}"`;
            if (h.Cookie) cmd += ` --header="Cookie: ${h.Cookie}"`;
            cmd += ` --user-agent="${h['User-Agent']}"`;
            cmd += ` -o "video_${Date.now()}.ts"`;
            cmd += ` "${url}"`;
            return cmd;
        }
    }

    const headerManager = new HeaderManager();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ███╗   ███╗███████╗██████╗ ██╗ █████╗      █████╗ ███╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗███████╗██████╗ 
    // ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗    ██╔══██╗████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝╚══███╔╝██╔════╝██╔══██╗
    // ██╔████╔██║█████╗  ██║  ██║██║███████║    ███████║██╔██╗ ██║███████║██║   ╚████╔╝   ███╔╝ █████╗  ██████╔╝
    // ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║    ██╔══██║██║╚██╗██║██╔══██║██║    ╚██╔╝   ███╔╝  ██╔══╝  ██╔══██╗
    // ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║    ██║  ██║██║ ╚████║██║  ██║███████╗██║   ███████╗███████╗██║  ██║
    // ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class MediaAnalyzer {
        constructor() {
            this.patterns = {
                hls: /\.(m3u8|m3u)(\?|#|$)/i,
                dash: /\.(mpd)(\?|#|$)/i,
                video: /\.(mp4|webm|mkv|avi|mov|flv|m4v|3gp|wmv|ogv)(\?|#|$)/i,
                audio: /\.(mp3|wav|ogg|m4a|aac|flac|opus|wma)(\?|#|$)/i,
                segment: /\.(ts|m4s|fmp4|m4f|m4v|m4a)(\?|#|$)/i,
                subtitle: /\.(vtt|srt|ass|ssa|sub|sbv)(\?|#|$)/i,
                image: /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?|#|$)/i
            };

            this.mimeTypes = {
                'application/vnd.apple.mpegurl': 'HLS',
                'application/x-mpegurl': 'HLS',
                'application/dash+xml': 'DASH',
                'video/mp4': 'VIDEO',
                'video/webm': 'VIDEO',
                'audio/mpeg': 'AUDIO',
                'audio/mp4': 'AUDIO',
                'video/mp2t': 'SEGMENT'
            };

            this.cdnPatterns = [
                { pattern: 'googlevideo.com', name: 'YouTube' },
                { pattern: 'ytimg.com', name: 'YouTube' },
                { pattern: 'vimeocdn.com', name: 'Vimeo' },
                { pattern: 'player.vimeo.com', name: 'Vimeo' },
                { pattern: 'akamaihd.net', name: 'Akamai' },
                { pattern: 'akamaized.net', name: 'Akamai' },
                { pattern: 'cloudfront.net', name: 'CloudFront' },
                { pattern: 'cloudflare', name: 'Cloudflare' },
                { pattern: 'fastly', name: 'Fastly' },
                { pattern: 'b-cdn.net', name: 'Bunny CDN' },
                { pattern: 'jwplatform.com', name: 'JW Player' },
                { pattern: 'jwpcdn.com', name: 'JW Player' },
                { pattern: 'brightcove', name: 'Brightcove' },
                { pattern: 'vidyard', name: 'Vidyard' },
                { pattern: 'wistia', name: 'Wistia' },
                { pattern: 'mediadelivery.net', name: 'Bunny' },
                { pattern: 'bitmovin', name: 'Bitmovin' },
                { pattern: 'mux.com', name: 'Mux' },
                { pattern: 'dailymotion', name: 'Dailymotion' },
                { pattern: 'twitch.tv', name: 'Twitch' }
            ];

            this.drmPatterns = [
                { pattern: 'widevine', name: 'Widevine' },
                { pattern: 'playready', name: 'PlayReady' },
                { pattern: 'fairplay', name: 'FairPlay' },
                { pattern: 'clearkey', name: 'ClearKey' },
                { pattern: 'license', name: 'License Server' },
                { pattern: 'drm', name: 'DRM' }
            ];
        }

        detect(url, mimeType = null) {
            const u = (url || '').toLowerCase();

            // Skip non-media
            if (this.patterns.image.test(u)) return null;
            if (u.length < 10) return null;
            if (u.includes('favicon')) return null;
            if (u.endsWith('.css') || u.endsWith('.js') || u.endsWith('.json')) return null;

            // Check mime type first
            if (mimeType && this.mimeTypes[mimeType]) {
                return this.buildResult(this.mimeTypes[mimeType], url);
            }

            // Pattern matching
            if (this.patterns.hls.test(u)) return this.buildResult('HLS', url);
            if (this.patterns.dash.test(u)) return this.buildResult('DASH', url);
            if (this.patterns.video.test(u)) return this.buildResult('VIDEO', url);
            if (this.patterns.audio.test(u)) return this.buildResult('AUDIO', url);
            if (this.patterns.subtitle.test(u)) return this.buildResult('SUBTITLE', url);
            if (this.patterns.segment.test(u)) return this.buildResult('SEGMENT', url);
            if (url.startsWith('blob:')) return this.buildResult('BLOB', url);

            // CDN detection
            for (const cdn of this.cdnPatterns) {
                if (u.includes(cdn.pattern)) {
                    return this.buildResult('CDN_STREAM', url, { cdn: cdn.name });
                }
            }

            // URL hints
            if (u.includes('/video/') || u.includes('/stream/') || u.includes('/media/')) {
                return this.buildResult('STREAM', url);
            }

            return null;
        }

        buildResult(type, url, extra = {}) {
            const result = {
                type,
                quality: this.detectQuality(url),
                resolution: this.detectResolution(url),
                downloadable: !['SEGMENT', 'BLOB'].includes(type),
                drm: this.detectDRM(url),
                ...extra
            };

            // Priority score for sorting
            const priorities = { HLS: 100, DASH: 95, VIDEO: 80, CDN_STREAM: 75, STREAM: 70, AUDIO: 60 };
            result.priority = priorities[type] || 50;

            return result;
        }

        detectQuality(url) {
            const u = (url || '').toLowerCase();
            const patterns = [
                { regex: /2160|4k|uhd|3840/i, quality: '4K' },
                { regex: /1440|2k|qhd|2560/i, quality: '1440p' },
                { regex: /1080|fhd|1920/i, quality: '1080p' },
                { regex: /720|hd|1280/i, quality: '720p' },
                { regex: /480|sd|854/i, quality: '480p' },
                { regex: /360|640/i, quality: '360p' },
                { regex: /240|426/i, quality: '240p' },
                { regex: /144/i, quality: '144p' }
            ];

            for (const p of patterns) {
                if (p.regex.test(u)) return p.quality;
            }
            return 'Auto';
        }

        detectResolution(url) {
            const match = url.match(/(\d{3,4})x(\d{3,4})/);
            if (match) return `${match[1]}x${match[2]}`;

            const heightMatch = url.match(/[_\-.](\d{3,4})p/i);
            if (heightMatch) {
                const h = parseInt(heightMatch[1]);
                const w = Math.round(h * 16 / 9);
                return `${w}x${h}`;
            }
            return null;
        }

        detectDRM(url) {
            const u = (url || '').toLowerCase();
            for (const drm of this.drmPatterns) {
                if (u.includes(drm.pattern)) {
                    return { protected: true, type: drm.name };
                }
            }
            return { protected: false, type: null };
        }

        isMedia(url) {
            return this.detect(url) !== null;
        }

        getTypeIcon(type) {
            const icons = {
                HLS: '📺', DASH: '📡', VIDEO: '🎬', AUDIO: '🎵',
                SUBTITLE: '📝', SEGMENT: '📦', BLOB: '💾',
                CDN_STREAM: '☁️', STREAM: '📻'
            };
            return icons[type] || '📁';
        }

        getTypeColor(type) {
            const colors = {
                HLS: '#00ddff', DASH: '#ff6b6b', VIDEO: '#aa88ff',
                AUDIO: '#ffaa00', SUBTITLE: '#88ff88', SEGMENT: '#888888',
                BLOB: '#ff8800', CDN_STREAM: '#00ff88', STREAM: '#ff88ff'
            };
            return colors[type] || '#ffffff';
        }
    }

    const mediaAnalyzer = new MediaAnalyzer();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██████╗ ██████╗  ██████╗ ██╗  ██╗██╗   ██╗    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗ 
    // ██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
    // ██████╔╝██████╔╝██║   ██║ ╚███╔╝  ╚████╔╝     ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝
    // ██╔═══╝ ██╔══██╗██║   ██║ ██╔██╗   ╚██╔╝      ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗
    // ██║     ██║  ██║╚██████╔╝██╔╝ ██╗   ██║       ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║
    // ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class ProxyManager {
        constructor() {
            this.proxyIndex = 0;
            this.failedProxies = new Set();
            this.requestCache = new Map();
            this.inflightRequests = new Map();
        }

        getProxyUrl(url) {
            const proxy = CONFIG.proxy.servers[this.proxyIndex % CONFIG.proxy.servers.length];
            return proxy + encodeURIComponent(url);
        }

        rotateProxy() {
            this.proxyIndex = (this.proxyIndex + 1) % CONFIG.proxy.servers.length;
            logger.log(`Rotated to proxy ${this.proxyIndex + 1}/${CONFIG.proxy.servers.length}`, 'info');
        }

        async fetchText(url, options = {}) {
            const res = await this.fetchWithRetry(url, { ...options, responseType: 'text' });
            return res.text;
        }

        async fetchArrayBuffer(url, options = {}) {
            const res = await this.fetchWithRetry(url, { ...options, responseType: 'arraybuffer' });
            return res.data;
        }

        async fetchBinary(url, options = {}) {
            return this.fetchArrayBuffer(url, options);
        }

        async fetchWithRetry(url, options = {}) {
            const {
                maxRetries = CONFIG.download.retryAttempts,
                responseType = 'arraybuffer',
                timeout = CONFIG.download.timeout,
                onProgress = null,
                useProxy = false,
                headers = {}
            } = options;

            // Check cache
            const cacheKey = `${url}_${responseType}`;
            if (this.requestCache.has(cacheKey)) {
                return this.requestCache.get(cacheKey);
            }

            // Dedup inflight requests
            if (this.inflightRequests.has(cacheKey)) {
                return this.inflightRequests.get(cacheKey);
            }

            const requestPromise = this._doFetch(url, { maxRetries, responseType, timeout, onProgress, useProxy, headers });
            this.inflightRequests.set(cacheKey, requestPromise);

            try {
                const result = await requestPromise;
                // Cache text responses (manifests)
                if (responseType === 'text') {
                    this.requestCache.set(cacheKey, result);
                    setTimeout(() => this.requestCache.delete(cacheKey), 60000); // 1 min cache
                }
                return result;
            } finally {
                this.inflightRequests.delete(cacheKey);
            }
        }

        async _doFetch(url, options) {
            const { maxRetries, responseType, timeout, onProgress, useProxy, headers } = options;
            let lastError;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const result = await this._singleFetch(
                        useProxy ? this.getProxyUrl(url) : url,
                        { responseType, timeout, onProgress, headers }
                    );
                    return result;
                } catch (e) {
                    lastError = e;
                    logger.log(`Request attempt ${attempt}/${maxRetries} failed: ${e.message}`, 'warning');

                    if (attempt < maxRetries) {
                        // Exponential backoff with jitter
                        const delay = Math.min(
                            CONFIG.download.retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
                            30000
                        );
                        await Utils.sleep(delay);

                        if (CONFIG.proxy.autoRotate) {
                            this.rotateProxy();
                        }
                    }
                }
            }

            throw lastError || new Error('Request failed after all retries');
        }

        _singleFetch(url, { responseType, timeout, onProgress, headers }) {
            return new Promise((resolve, reject) => {
                const capturedHeaders = headerManager.get(url);
                const finalHeaders = {
                    'Referer': capturedHeaders.Referer || window.location.href,
                    'Origin': capturedHeaders.Origin || window.location.origin,
                    ...headers
                };

                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        headers: finalHeaders,
                        responseType,
                        timeout,
                        onload: (response) => {
                            if (response.status >= 200 && response.status < 400) {
                                STATE.networkStats.bytesIn += response.response?.byteLength || 0;
                                resolve({
                                    ok: true,
                                    status: response.status,
                                    data: response.response,
                                    text: response.responseText,
                                    headers: response.responseHeaders
                                });
                            } else {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            }
                        },
                        onerror: (err) => reject(new Error(err.error || 'Network error')),
                        ontimeout: () => reject(new Error('Request timeout')),
                        onprogress: (e) => {
                            if (onProgress && e.lengthComputable) {
                                onProgress({ loaded: e.loaded, total: e.total });
                            }
                        }
                    });
                } else {
                    fetch(url, { headers: finalHeaders })
                        .then(r => {
                            if (!r.ok) throw new Error(`HTTP ${r.status}`);
                            return responseType === 'text' ? r.text() : r.arrayBuffer();
                        })
                        .then(data => resolve({ ok: true, data, text: data }))
                        .catch(reject);
                }
            });
        }

        async fetchText(url, options = {}) {
            const response = await this.fetchWithRetry(url, { ...options, responseType: 'text' });
            return response.text || (typeof response.data === 'string' ? response.data : new TextDecoder().decode(response.data));
        }

        async fetchBinary(url, options = {}) {
            const response = await this.fetchWithRetry(url, { ...options, responseType: 'arraybuffer' });
            return response.data;
        }

        async fetchArrayBuffer(url, options = {}) { return this.fetchBinary(url, options); }

        clearCache() {
            this.requestCache.clear();
        }
    }

    const proxyManager = new ProxyManager();

    // ═══════════════════════════════════════════════════════════════════════════════
    //  ██████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗    ██████╗  ██████╗  ██████╗ ██╗     
    // ██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║    ██╔══██╗██╔═══██╗██╔═══██╗██║     
    // ██║     ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║    ██████╔╝██║   ██║██║   ██║██║     
    // ██║     ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║    ██╔═══╝ ██║   ██║██║   ██║██║     
    // ╚██████╗╚██████╔╝██║ ╚████║██║ ╚████║███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║    ██║     ╚██████╔╝╚██████╔╝███████╗
    //  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝      ╚═════╝  ╚═════╝ ╚══════╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class ConnectionPool {
        constructor(maxConcurrent = 6) {
            this.maxConcurrent = maxConcurrent;
            this.activeCount = 0;
            this.queue = [];
        }

        async execute(fn) {
            return new Promise((resolve, reject) => {
                const run = async () => {
                    this.activeCount++;
                    try {
                        const result = await fn();
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    } finally {
                        this.activeCount--;
                        this.processQueue();
                    }
                };

                if (this.activeCount < this.maxConcurrent) {
                    run();
                } else {
                    this.queue.push(run);
                }
            });
        }

        processQueue() {
            while (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
                const next = this.queue.shift();
                next();
            }
        }

        async downloadAll(items, downloadFn, onProgress) {
            const results = [];
            let completed = 0;
            const total = items.length;

            const downloadPromises = items.map((item, index) =>
                this.execute(async () => {
                    const result = await downloadFn(item, index);
                    completed++;
                    if (onProgress) {
                        onProgress({ completed, total, index, item });
                    }
                    return result;
                })
            );

            return Promise.all(downloadPromises);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██████╗  ██████╗ ██╗    ██╗███╗   ██╗██╗      ██████╗  █████╗ ██████╗ ███████╗██████╗ 
    // ██╔══██╗██╔═══██╗██║    ██║████╗  ██║██║     ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
    // ██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║██║     ██║   ██║███████║██║  ██║█████╗  ██████╔╝
    // ██║  ██║██║   ██║██║███╗██║██║╚██╗██║██║     ██║   ██║██╔══██║██║  ██║██╔══╝  ██╔══██╗
    // ██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗╚██████╔╝██║  ██║██████╔╝███████╗██║  ██║
    // ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class HLSDownloader {
        constructor() {
            this.connectionPool = new ConnectionPool(CONFIG.download.maxConcurrent);
            this.downloads = new Map();
            this.recordings = new Map();
        }

        async parseM3U8(url) {
            logger.log(`Parsing M3U8: ${url.substring(0, 60)}...`, 'info');

            const content = await proxyManager.fetchText(url);
            const lines = content.split('\n').map(l => l.trim()).filter(l => l);

            const result = {
                type: 'unknown',
                segments: [],
                qualities: [],
                audioTracks: [],
                subtitles: [],
                duration: 0,
                encrypted: false,
                keyUrl: null,
                baseUrl: url.substring(0, url.lastIndexOf('/') + 1)
            };

            let currentDuration = 0;
            let currentKey = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Master playlist - quality variants
                if (line.startsWith('#EXT-X-STREAM-INF')) {
                    result.type = 'master';
                    const resolution = line.match(/RESOLUTION=(\d+x\d+)/);
                    const bandwidth = line.match(/BANDWIDTH=(\d+)/);
                    const codecs = line.match(/CODECS="([^"]+)"/);
                    const audio = line.match(/AUDIO="([^"]+)"/);
                    const nextLine = lines[i + 1];

                    if (nextLine && !nextLine.startsWith('#')) {
                        result.qualities.push({
                            url: Utils.resolveUrl(url, nextLine),
                            resolution: resolution ? resolution[1] : 'unknown',
                            bandwidth: bandwidth ? parseInt(bandwidth[1]) : 0,
                            codecs: codecs ? codecs[1] : 'unknown',
                            height: resolution ? parseInt(resolution[1].split('x')[1]) : 0,
                            audioGroup: audio ? audio[1] : null
                        });
                    }
                }

                // Audio tracks
                if (line.startsWith('#EXT-X-MEDIA') && line.includes('TYPE=AUDIO')) {
                    const name = line.match(/NAME="([^"]+)"/);
                    const uri = line.match(/URI="([^"]+)"/);
                    const language = line.match(/LANGUAGE="([^"]+)"/);
                    const defaultTrack = line.includes('DEFAULT=YES');

                    if (uri) {
                        result.audioTracks.push({
                            url: Utils.resolveUrl(url, uri[1]),
                            name: name ? name[1] : 'Audio',
                            language: language ? language[1] : 'und',
                            default: defaultTrack
                        });
                    }
                }

                // Subtitles
                if (line.startsWith('#EXT-X-MEDIA') && line.includes('TYPE=SUBTITLES')) {
                    const name = line.match(/NAME="([^"]+)"/);
                    const uri = line.match(/URI="([^"]+)"/);
                    const language = line.match(/LANGUAGE="([^"]+)"/);

                    if (uri) {
                        result.subtitles.push({
                            url: Utils.resolveUrl(url, uri[1]),
                            name: name ? name[1] : 'Subtitles',
                            language: language ? language[1] : 'und'
                        });
                    }
                }

                // Encryption key
                if (line.startsWith('#EXT-X-KEY')) {
                    const method = line.match(/METHOD=([^,]+)/);
                    const keyUri = line.match(/URI="([^"]+)"/);
                    if (method && method[1] !== 'NONE') {
                        result.encrypted = true;
                        if (keyUri) {
                            result.keyUrl = Utils.resolveUrl(url, keyUri[1]);
                            currentKey = result.keyUrl;
                        }
                    }
                }

                // Segment duration
                if (line.startsWith('#EXTINF:')) {
                    const dur = parseFloat(line.split(':')[1]);
                    if (!isNaN(dur)) currentDuration = dur;
                }

                // Segment URL
                if (!line.startsWith('#') && line.length > 0) {
                    const isSegment = line.endsWith('.ts') || line.includes('.ts?') ||
                        line.endsWith('.m4s') || line.includes('.m4s?') ||
                        line.includes('segment') || line.includes('chunk') ||
                        line.includes('frag');

                    if (isSegment || result.type === 'unknown') {
                        result.segments.push({
                            url: Utils.resolveUrl(url, line),
                            duration: currentDuration,
                            key: currentKey,
                            index: result.segments.length
                        });
                        result.duration += currentDuration;
                        result.type = 'media';
                        currentDuration = 0;
                    }
                }
            }

            if (result.qualities.length > 0) {
                result.qualities.sort((a, b) => b.height - a.height);
            }

            // (NEW) Auto-Register Subtitles and Audio
            if (typeof mediaCapture !== 'undefined') {
                result.audioTracks.forEach(t => mediaCapture.add(t.url, 'HLS_AUDIO', { type: 'AUDIO', label: t.name, lang: t.language }));
                result.subtitles.forEach(s => mediaCapture.add(s.url, 'HLS_SUBTITLE', { type: 'SUBTITLE', label: s.name, lang: s.language }));
            }

            logger.log(`Parsed: ${result.type}, ${result.segments.length} segments, ${result.qualities.length} qualities, ${Utils.formatDuration(result.duration)}`, 'success');
            return result;
        }

        createDownload(url, options = {}) {
            const id = Utils.generateId();
            const download = {
                id,
                url,
                options,
                status: 'pending',
                progress: { current: 0, total: 0, bytes: 0, speed: 0, percent: 0 },
                startTime: null,
                chunks: [],
                cancelled: false,
                paused: false,
                error: null
            };

            this.downloads.set(id, download);
            Events.emit('download-created', download);

            return download;
        }

        async startDownload(downloadId) {
            const download = this.downloads.get(downloadId);
            if (!download) throw new Error('Download not found');

            download.status = 'downloading';
            download.startTime = Date.now();
            Events.emit('download-started', download);

            try {
                // Parse M3U8
                let parsed = await this.parseM3U8(download.url);

                // If master playlist, get best quality or user selected
                if (parsed.type === 'master' && parsed.qualities.length > 0) {
                    const quality = download.options.quality || parsed.qualities[0];
                    download.selectedQuality = quality;
                    logger.log(`Selected: ${quality.resolution} (${Utils.formatBytes(quality.bandwidth)}/s)`, 'info');
                    parsed = await this.parseM3U8(quality.url);
                }

                if (!parsed.segments || parsed.segments.length === 0) {
                    throw new Error('No segments found');
                }

                if (parsed.encrypted) {
                    logger.log(`⚠️ Stream is encrypted (key: ${parsed.keyUrl})`, 'warning');
                }

                download.progress.total = parsed.segments.length;
                download.duration = parsed.duration;

                // Download segments with connection pool
                const downloadSegment = async (segment, index) => {
                    if (download.cancelled) throw new Error('Cancelled');
                    while (download.paused) {
                        await Utils.sleep(500);
                        if (download.cancelled) throw new Error('Cancelled');
                    }

                    const data = await proxyManager.fetchBinary(segment.url);
                    download.progress.current = index + 1;
                    download.progress.bytes += data.byteLength;

                    const elapsed = (Date.now() - download.startTime) / 1000;
                    download.progress.speed = elapsed > 0 ? download.progress.bytes / elapsed : 0;
                    download.progress.percent = Math.round((download.progress.current / download.progress.total) * 100);
                    download.progress.eta = download.progress.speed > 0
                        ? (download.progress.total - download.progress.current) * (download.progress.bytes / download.progress.current) / download.progress.speed
                        : 0;

                    Events.emit('download-progress', download);
                    return new Uint8Array(data);
                };

                const chunks = await this.connectionPool.downloadAll(
                    parsed.segments,
                    downloadSegment,
                    () => { }
                );

                download.chunks = chunks;

                // Merge chunks
                logger.log('Merging segments...', 'info');
                const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const merged = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    merged.set(chunk, offset);
                    offset += chunk.length;
                }

                // Create blob and trigger download
                const blob = new Blob([merged], { type: 'video/mp2t' });
                const filename = download.options.filename || `video_${download.selectedQuality?.resolution || 'auto'}_${Date.now()}.ts`;

                this.saveBlob(blob, filename);

                download.status = 'completed';
                download.filename = filename;
                download.size = blob.size;

                logger.log(`✅ Download complete! ${filename} (${Utils.formatBytes(blob.size)})`, 'success');
                logger.incrementStat('downloads');
                Events.emit('download-completed', download);

                return download;

            } catch (e) {
                download.status = 'error';
                download.error = e.message;
                logger.log(`❌ Download failed: ${e.message}`, 'error');
                logger.incrementStat('errors');
                Events.emit('download-error', download);
                throw e;
            }
        }

        pauseDownload(downloadId) {
            const download = this.downloads.get(downloadId);
            if (download && download.status === 'downloading') {
                download.paused = true;
                download.status = 'paused';
                Events.emit('download-paused', download);
                logger.log('Download paused', 'info');
            }
        }

        resumeDownload(downloadId) {
            const download = this.downloads.get(downloadId);
            if (download && download.status === 'paused') {
                download.paused = false;
                download.status = 'downloading';
                Events.emit('download-resumed', download);
                logger.log('Download resumed', 'info');
            }
        }

        cancelDownload(downloadId) {
            const download = this.downloads.get(downloadId);
            if (download) {
                download.cancelled = true;
                download.status = 'cancelled';
                Events.emit('download-cancelled', download);
                logger.log('Download cancelled', 'warning');
            }
        }

        async getQualities(url) {
            try {
                const parsed = await this.parseM3U8(url);
                if (parsed.type === 'master' && parsed.qualities.length > 0) {
                    return {
                        qualities: parsed.qualities,
                        audioTracks: parsed.audioTracks,
                        subtitles: parsed.subtitles
                    };
                }
                return { qualities: [{ url, resolution: 'Default', bandwidth: 0, height: 0 }], audioTracks: [], subtitles: [] };
            } catch (e) {
                return { qualities: [{ url, resolution: 'Default', bandwidth: 0, height: 0 }], audioTracks: [], subtitles: [] };
            }
        }

        isRecording(url) {
            for (const r of this.recordings.values()) {
                if (r.originalUrl === url || r.url === url) return r;
            }
            return null;
        }

        startRecording(url) {
            const id = Utils.generateId();
            const recording = {
                id,
                originalUrl: url,
                url, // May change if master -> variant
                status: 'recording',
                startTime: Date.now(),
                segments: new Set(),
                chunks: [],
                totalDuration: 0,
                totalBytes: 0,
                stop: false
            };
            this.recordings.set(id, recording);
            this.pollRecording(recording);
            logger.log('Started recording stream...', 'info');
            Events.emit('recording-started', recording);
            return recording;
        }

        stopRecording(id) {
            const rec = this.recordings.get(id);
            if (rec) rec.stop = true;
        }

        async pollRecording(rec) {
            let errorCount = 0;
            while (!rec.stop) {
                try {
                    const parsed = await this.parseM3U8(rec.url);
                    if (parsed.type === 'master' && parsed.qualities.length > 0) {
                        rec.url = parsed.qualities[0].url;
                        continue;
                    }

                    const newSegments = parsed.segments.filter(s => !rec.segments.has(s.url));
                    if (newSegments.length > 0) {
                        for (const seg of newSegments) {
                            if (rec.stop) break;
                            rec.segments.add(seg.url);
                            const data = await proxyManager.fetchBinary(seg.url);
                            rec.chunks.push(new Uint8Array(data));
                            rec.totalDuration += seg.duration;
                            rec.totalBytes += data.byteLength;
                            Events.emit('recording-progress', rec);
                        }
                    }
                    errorCount = 0;
                } catch (e) {
                    errorCount++;
                    if (errorCount > 20) rec.stop = true;
                }
                if (!rec.stop) await Utils.sleep(3000);
            }
            this.finishRecording(rec);
        }

        finishRecording(rec) {
            logger.log('Processing recording...', 'info');
            const totalLength = rec.chunks.reduce((acc, c) => acc + c.length, 0);
            const merged = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of rec.chunks) {
                merged.set(chunk, offset);
                offset += chunk.length;
            }
            const blob = new Blob([merged], { type: 'video/mp2t' });
            const filename = `recording_${Date.now()}.ts`;
            this.saveBlob(blob, filename);
            logger.log(`Recording saved: ${filename}`, 'success');
            this.recordings.delete(rec.id);
            Events.emit('recording-completed', rec);
        }

        saveBlob(blob, filename) {
            if (typeof GM_download !== 'undefined') {
                const url = URL.createObjectURL(blob);
                GM_download({
                    url: url,
                    name: filename,
                    saveAs: true,
                    onload: () => { URL.revokeObjectURL(url); logger.log('GM_download success', 'success'); },
                    onerror: (e) => { logger.log('GM_download failed: ' + (e.error || e), 'warning'); this.fallbackSave(blob, filename); }
                });
                return;
            }
            this.fallbackSave(blob, filename);
        }

        fallbackSave(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        }

        getDownload(id) { return this.downloads.get(id); }
        getAllDownloads() { return Array.from(this.downloads.values()); }
    }

    const hlsDownloader = new HLSDownloader();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ███████╗██████╗  █████╗ ███╗   ███╗███████╗    ███╗   ███╗███████╗███████╗███████╗███████╗███╗   ██╗ ██████╗ ███████╗██████╗ 
    // ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝    ████╗ ████║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝ ██╔════╝██╔══██╗
    // █████╗  ██████╔╝███████║██╔████╔██║█████╗      ██╔████╔██║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║██║  ███╗█████╗  ██████╔╝
    // ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝      ██║╚██╔╝██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║██║   ██║██╔══╝  ██╔══██╗
    // ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗    ██║ ╚═╝ ██║███████╗███████║███████║███████╗██║ ╚████║╚██████╔╝███████╗██║  ██║
    // ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝    ╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class FrameMessenger {
        constructor() {
            this.handlers = new Map();
            this.init();
        }

        init() {
            window.addEventListener('message', (e) => {
                if (!e.data?.type?.startsWith('UADBP_')) return;
                const handler = this.handlers.get(e.data.type);
                if (handler) handler(e.data.payload, e.source, e.origin);
            });
        }

        on(type, handler) { this.handlers.set(type, handler); }

        send(type, payload, target = window.top) {
            try { target.postMessage({ type, payload }, '*'); } catch (e) { }
        }

        broadcast(type, payload) {
            if (window.parent !== window) this.send(type, payload, window.parent);
            if (window.top !== window) this.send(type, payload, window.top);
            try {
                document.querySelectorAll('iframe').forEach(f => {
                    try { this.send(type, payload, f.contentWindow); } catch (e) { }
                });
            } catch (e) { }
        }
    }

    const messenger = new FrameMessenger();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ███╗   ███╗███████╗██████╗ ██╗ █████╗      ██████╗ █████╗ ██████╗ ████████╗██╗   ██╗██████╗ ███████╗
    // ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗    ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║   ██║██╔══██╗██╔════╝
    // ██╔████╔██║█████╗  ██║  ██║██║███████║    ██║     ███████║██████╔╝   ██║   ██║   ██║██████╔╝█████╗  
    // ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║    ██║     ██╔══██║██╔═══╝    ██║   ██║   ██║██╔══██╗██╔══╝  
    // ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║    ╚██████╗██║  ██║██║        ██║   ╚██████╔╝██║  ██║███████╗
    // ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝     ╚═════╝╚═╝  ╚═╝╚═╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class MediaCapture {
        constructor() {
            this.mediaUrls = STATE.mediaUrls;
            this.scanInterval = null;
            this.lastScanTime = 0;
            this.scanThrottle = 2000;
        }

        init() {
            if (STATE.isMainFrame) {
                messenger.on('UADBP_MEDIA_CAPTURED', (payload) => this.addFromMessage(payload));
                if (CONFIG.storage.autoSave) this.loadFromStorage();
            }

            if (CONFIG.features.networkIntercept) this.interceptNetwork();
            if (CONFIG.features.blobCapture) this.interceptBlob();
            if (CONFIG.features.webSocketCapture) this.interceptWebSocket();
            this.interceptHLS(); // (NEW) Direct HLS hook
            if (CONFIG.features.autoClear) this.setupAutoClear();
            if (CONFIG.features.autoScan) {
                this.startAutoScan();
                // Continuous shallow scan to replace manual "Force Scan"
                setInterval(() => this.scanDOM(), 4000);
            }

            setTimeout(() => this.scanDOM(), 500);
            logger.log('Media capture initialized', 'success');
        }

        interceptNetwork() {
            const self = this;

            // Intercept Fetch
            const origFetch = window.fetch;
            window.fetch = async function (...args) {
                const url = args[0] instanceof Request ? args[0].url : String(args[0]);
                STATE.networkStats.requests++;

                if (self.isMedia(url)) {
                    STATE.networkStats.mediaRequests++;
                    const headers = args[1]?.headers || {};
                    headerManager.capture(url, headers);
                    self.add(url, 'FETCH');
                }
                return origFetch.apply(this, args).then(res => {
                    const len = res.headers.get('content-length');
                    if (len) STATE.networkStats.bytesIn += parseInt(len, 10);
                    return res;
                });
            };

            // Intercept XHR
            const origOpen = XMLHttpRequest.prototype.open;
            const origSend = XMLHttpRequest.prototype.send;
            const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;

            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                this._uadbp_url = url;
                this._uadbp_headers = {};
                return origOpen.call(this, method, url, ...rest);
            };

            XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
                if (this._uadbp_headers) this._uadbp_headers[name] = value;
                return origSetHeader.call(this, name, value);
            };

            XMLHttpRequest.prototype.send = function (body) {
                STATE.networkStats.requests++;
                if (this._uadbp_url && self.isMedia(this._uadbp_url)) {
                    STATE.networkStats.mediaRequests++;
                    headerManager.capture(this._uadbp_url, this._uadbp_headers || {});
                    self.add(this._uadbp_url, 'XHR');
                }
                const res = origSend.call(this, body);

                this.addEventListener('load', () => {
                    const len = this.getResponseHeader('Content-Length');
                    if (len) STATE.networkStats.bytesIn += parseInt(len, 10);
                });
                return res;
            };
        }

        interceptBlob() {
            const self = this;
            const origCreateObjectURL = URL.createObjectURL;

            URL.createObjectURL = function (blob) {
                const url = origCreateObjectURL.call(this, blob);
                if (blob instanceof Blob) {
                    const type = blob.type || '';
                    if (type.includes('video') || type.includes('audio') || type.includes('mpegurl')) {
                        self.add(url, 'BLOB', {
                            blobType: type,
                            blobSize: blob.size,
                            sizeFormatted: Utils.formatBytes(blob.size)
                        });
                    }
                }
                return url;
            };
        }

        interceptWebSocket() {
            const self = this;
            const origWebSocket = window.WebSocket;
            if (origWebSocket._uadbp) return;

            window.WebSocket = new Proxy(origWebSocket, {
                construct(target, args) {
                    const ws = Reflect.construct(target, args);
                    const url = args[0];
                    if (url && typeof url === 'string' && self.isMedia(url)) {
                        self.add(url, 'WEBSOCKET');
                    }
                    return ws;
                }
            });
            window.WebSocket._uadbp = true;
        }

        // (NEW) Direct HLS.js Hook
        interceptHLS() {
            if (this._hlsHooked) return;
            this._hlsHooked = true;

            const hook = () => {
                if (window.Hls && window.Hls.prototype && window.Hls.prototype.loadSource && !window.Hls.prototype._uadbp_hook) {
                    const origLoad = window.Hls.prototype.loadSource;
                    window.Hls.prototype.loadSource = function (url) {
                        if (url) {
                            logger.log(`HLS Hook Captured: ${url}`, 'info');
                            mediaCapture.add(url, 'HLS_HOOK');
                        }
                        return origLoad.apply(this, arguments);
                    };
                    window.Hls.prototype._uadbp_hook = true;
                    logger.log('HLS.js hooked successfully', 'success');
                }
            };

            // Try immediately and periodically
            hook();
            const interval = setInterval(() => {
                if (window.Hls && window.Hls.prototype._uadbp_hook) clearInterval(interval);
                else hook();
            }, 1000);
        }

        setupAutoClear() {
            if (this._autoClearSetup) return;
            this._autoClearSetup = true;
            this.lastPath = window.location.pathname;

            const check = () => {
                // (FIX) Only clear on actual path changes, ignore query/hash updates
                const cur = window.location.pathname;
                if (cur !== this.lastPath) {
                    // logger.log('Navigation detected. Auto-clearing media...', 'info');
                    this.clear();
                    this.lastPath = cur;
                    if (typeof uiPanel !== 'undefined') uiPanel.updateUI();
                }
            };

            const origPush = history.pushState;
            const origRepl = history.replaceState;

            history.pushState = function (...args) {
                const res = origPush.apply(this, args);
                check();
                return res;
            };
            history.replaceState = function (...args) {
                const res = origRepl.apply(this, args);
                check();
                return res;
            };
            window.addEventListener('popstate', check);
        }

        startAutoScan() {
            if (this.scanInterval) return;

            this.scanInterval = setInterval(() => {
                if (Date.now() - this.lastScanTime >= this.scanThrottle) {
                    this.scanDOM();
                }
            }, 3000);

            const observer = new MutationObserver(Utils.debounce(() => this.scanDOM(), 500));
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'data-src', 'data-video-src', 'href']
            });
        }

        scanDOM() {
            this.lastScanTime = Date.now();

            // Video/Audio elements
            document.querySelectorAll('video, audio').forEach(el => {
                [el.src, el.currentSrc].forEach(src => {
                    if (src && this.isMedia(src)) this.add(src, 'DOM_ELEMENT');
                });
                el.querySelectorAll('source').forEach(source => {
                    if (source.src && this.isMedia(source.src)) this.add(source.src, 'SOURCE_TAG');
                });
            });

            // Deep scan
            if (CONFIG.features.deepScan) {
                const attrs = ['data-src', 'data-video', 'data-url', 'data-hls', 'data-stream',
                    'data-video-src', 'data-dash', 'data-m3u8', 'data-manifest', 'data-source'];

                attrs.forEach(attr => {
                    document.querySelectorAll(`[${attr}]`).forEach(el => {
                        const val = el.getAttribute(attr);
                        if (val && this.isMedia(val)) this.add(val, 'DATA_ATTR');
                    });
                });

                // Script content scan
                document.querySelectorAll('script:not([src])').forEach(script => {
                    const content = script.textContent || '';
                    const patterns = [
                        /https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi,
                        /https?:\/\/[^\s"'<>]+\.mpd[^\s"'<>]*/gi,
                        /https?:\/\/[^\s"'<>]*(?:video|stream|media)[^\s"'<>]*\.mp4[^\s"'<>]*/gi
                    ];
                    patterns.forEach(pattern => {
                        const matches = content.match(pattern);
                        if (matches) {
                            matches.forEach(url => {
                                const clean = url.replace(/["'\\]/g, '');
                                if (this.isMedia(clean)) this.add(clean, 'SCRIPT_CONTENT');
                            });
                        }
                    });
                });
            }
        }

        isMedia(url) {
            return mediaAnalyzer.isMedia(url);
        }

        add(url, context, extra = {}) {
            if (!url || this.mediaUrls.has(url)) return;

            const info = mediaAnalyzer.detect(url);
            if (!info) return;

            const entry = {
                id: Utils.generateId(),
                url,
                context,
                ...info,
                ...extra,
                time: Date.now(),
                timeFormatted: Utils.formatTime(Date.now()),
                frame: STATE.isMainFrame ? 'main' : 'iframe',
                pageUrl: window.location.href,
                domain: Utils.extractDomain(url)
            };

            this.mediaUrls.set(url, entry);
            headerManager.capture(url);
            logger.incrementStat('captures');

            const icon = mediaAnalyzer.getTypeIcon(info.type);
            const shortUrl = url.length > 60 ? url.substring(0, 60) + '...' : url;
            logger.log(`${icon} Captured ${info.type}: ${shortUrl}`, 'capture');

            if (!STATE.isMainFrame && CONFIG.features.crossFrameCapture) {
                messenger.send('UADBP_MEDIA_CAPTURED', entry);
            }

            Events.emit('media-update', { list: this.getList(), count: this.mediaUrls.size });
            if (CONFIG.storage.autoSave && STATE.isMainFrame) this.saveToStorage();
        }

        addFromMessage(entry) {
            if (!entry?.url || this.mediaUrls.has(entry.url)) return;
            entry.fromFrame = true;
            this.mediaUrls.set(entry.url, entry);
            if (entry.type !== 'SEGMENT') {
                logger.log(`📨 Received from iframe: ${entry.type}`, 'info');
            }
            Events.emit('media-update', { list: this.getList(), count: this.mediaUrls.size });
        }

        getList() {
            return Array.from(this.mediaUrls.values())
                .sort((a, b) => (b.priority || 0) - (a.priority || 0) || b.time - a.time);
        }

        getByType(type) { return this.getList().filter(m => m.type === type); }

        clear() {
            const count = this.mediaUrls.size;
            this.mediaUrls.clear();
            STATE.mediaUrls.clear();
            Events.emit('media-update', { list: [], count: 0 });
            if (count > 0) logger.log(`Media list cleared (${count} items)`, 'warning');
        }

        exportJSON() { return JSON.stringify(this.getList(), null, 2); }

        exportM3U() {
            let m3u = '#EXTM3U\n';
            this.getList().forEach(m => {
                m3u += `#EXTINF:-1,${m.type} - ${m.quality} - ${m.timeFormatted}\n${m.url}\n`;
            });
            return m3u;
        }

        saveToStorage() {
            if (this._saveTimer) clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(() => {
                if (typeof GM_setValue === 'undefined') return;
                const list = this.getList();
                if (list.length === 0) return; // (FIX) Don't save empty list to prevent accidental wipe

                const savedList = list.map(m => ({ ...m, context: 'RESTORED' }));
                GM_setValue('savedMedia', JSON.stringify(savedList));
            }, 1000);
        }

        loadFromStorage() {
            if (!CONFIG.storage.autoSave || typeof GM_getValue === 'undefined') return; // (FIX) Check setting
            try {
                const stored = JSON.parse(GM_getValue('savedMedia', '[]'));
                const now = Date.now();
                let restored = 0;
                stored.forEach(m => {
                    if (now - m.time < CONFIG.storage.maxAge) {
                        this.mediaUrls.set(m.url, m);
                        restored++;
                    }
                });
                if (restored > 0) {
                    // logger.log(`Restored ${restored} media items`, 'info'); // (FIX) Silent
                    Events.emit('media-update', { list: this.getList(), count: this.mediaUrls.size });
                }
            } catch (e) { }
        }
    }

    const mediaCapture = new MediaCapture();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ███████╗████████╗██████╗ ███████╗ █████╗ ███╗   ███╗    ██████╗ ███████╗ ██████╗ 
    // ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔══██╗████╗ ████║    ██╔══██╗██╔════╝██╔════╝ 
    // ███████╗   ██║   ██████╔╝█████╗  ███████║██╔████╔██║    ██████╔╝█████╗  ██║      
    // ╚════██║   ██║   ██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║    ██╔══██╗██╔══╝  ██║      
    // ███████║   ██║   ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║    ██║  ██║███████╗╚██████╗ 
    // ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝  ╚═╝╚══════╝ ╚═════╝ 
    // ═══════════════════════════════════════════════════════════════════════════════

    class StreamRecorder {
        constructor() {
            this.recorder = null;
            this.chunks = [];
            this.stream = null;
            this.isRecording = false;
            this.timer = null;
            this.startTime = 0;
        }

        async start(element = null) {
            try {
                if (this.isRecording) return;

                const mimeType = [
                    'video/webm;codecs=vp9,opus',
                    'video/webm;codecs=vp8,opus',
                    'video/webm'
                ].find(t => MediaRecorder.isTypeSupported(t)) || '';

                if (element instanceof HTMLVideoElement || element instanceof HTMLCanvasElement) {
                    // Element capture
                    this.stream = element.captureStream ? element.captureStream() : element.mozCaptureStream();
                    // Try to add audio track if missing from captureStream (e.g. muted video)
                    // Note: captureStream usually includes audio if video element has it.
                } else {
                    // Screen/Tab capture (Universal - Zoom, etc)
                    this.stream = await navigator.mediaDevices.getDisplayMedia({
                        video: { cursor: "always", frameRate: 30 },
                        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
                    });
                }

                if (!this.stream) throw new Error('No stream available');

                this.recorder = new MediaRecorder(this.stream, { mimeType, videoBitsPerSecond: 2500000 });
                this.chunks = [];

                this.recorder.ondataavailable = e => { if (e.data.size > 0) this.chunks.push(e.data); };
                this.recorder.onstop = () => this.save();

                this.recorder.start(1000);
                this.isRecording = true;
                this.startTime = Date.now();

                logger.log('Stream recording started', 'success');
                Events.emit('stream-record-start');
                this.startTimer();

                // Stop if stream ends (user clicks "Stop sharing")
                this.stream.getVideoTracks()[0].onended = () => this.stop();

            } catch (e) {
                logger.log('Recording failed: ' + e.message, 'error');
                this.isRecording = false;
            }
        }

        stop() {
            if (this.recorder && this.isRecording) {
                this.recorder.stop();
                this.stream.getTracks().forEach(t => t.stop());
                this.isRecording = false;
                this.stopTimer();
                Events.emit('stream-record-stop');
            }
        }

        save() {
            if (this.chunks.length === 0) return;
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const filename = `stream_record_${Utils.formatRelative(this.startTime).replace(/\s/g, '_')}_${Date.now()}.webm`;

            if (typeof GM_download !== 'undefined') {
                const url = URL.createObjectURL(blob);
                GM_download({
                    url,
                    name: filename,
                    saveAs: true,
                    onload: () => URL.revokeObjectURL(url)
                });
            } else {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();
            }
            logger.log(`Recording saved: ${filename}`, 'success');
        }

        startTimer() {
            this.timer = setInterval(() => {
                const dur = Math.floor((Date.now() - this.startTime) / 1000);
                const el = document.getElementById('uadbp-rec-timer');
                if (el) el.textContent = Utils.formatDuration(dur);
            }, 1000);
        }

        stopTimer() { clearInterval(this.timer); }

        getDuration() { return this.isRecording ? Math.floor((Date.now() - this.startTime) / 1000) : 0; }
    }

    const streamRecorder = new StreamRecorder();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██╗   ██╗██╗██████╗ ███████╗ ██████╗     ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗ 
    // ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗    ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗
    // ██║   ██║██║██║  ██║█████╗  ██║   ██║    ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝
    // ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║    ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗
    //  ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝    ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║
    //   ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝     ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class VideoPlayer {
        constructor() {
            this.hls = null;
            this.dash = null;
            this.modal = null;
            this.video = null;
            this.currentUrl = null;
            this.speeds = CONFIG.player.speeds;
            this.currentSpeedIndex = this.speeds.indexOf(1);
            this.filters = { brightness: 100, contrast: 100, saturate: 100, hue: 0 };
        }

        createModal() {
            document.getElementById('uadbp-player-modal')?.remove();

            const modal = document.createElement('div');
            modal.id = 'uadbp-player-modal';
            modal.className = 'uadbp-modal';
            modal.innerHTML = `
                <div class="uadbp-modal-content uadbp-player-content">
                    <div class="uadbp-player-header">
                        <span class="uadbp-player-title">🎬 UADBP Advanced Player</span>
                        <div class="uadbp-player-header-btns">
                            <button class="uadbp-player-btn" id="uadbp-pip" title="Picture-in-Picture">📺</button>
                            <button class="uadbp-player-btn" id="uadbp-screenshot" title="Screenshot">📸</button>
                            <button class="uadbp-player-btn" id="uadbp-fullscreen" title="Fullscreen">⛶</button>
                            <button class="uadbp-player-btn close" id="uadbp-player-close">✕</button>
                        </div>
                    </div>
                    <div class="uadbp-player-video-container" id="uadbp-video-container">
                        <video id="uadbp-video-element" controls playsinline></video>
                        <div id="uadbp-player-overlay" class="uadbp-player-overlay">
                            <div class="uadbp-player-loader"></div>
                            <span>Loading...</span>
                        </div>
                    </div>
                    <div class="uadbp-player-controls">
                        <div class="uadbp-player-info">
                            <select id="uadbp-quality-select" class="uadbp-select">
                                <option value="-1">Auto Quality</option>
                            </select>
                            <select id="uadbp-audio-select" class="uadbp-select">
                                <option value="-1">Default Audio</option>
                            </select>
                            <select id="uadbp-subtitle-select" class="uadbp-select">
                                <option value="-1">Subtitles: Off</option>
                            </select>
                            <select id="uadbp-speed-select" class="uadbp-select">
                                ${this.speeds.map(s => `<option value="${s}" ${s === 1 ? 'selected' : ''}>${s}x</option>`).join('')}
                            </select>
                            <span id="uadbp-player-status" class="uadbp-player-status"></span>
                        </div>
                        <div class="uadbp-player-toolbar">
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-primary" id="uadbp-player-download">⬇️ Download</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-player-commands">🔧 Commands</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-player-filters">🎨 Filters</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-player-copy">📋 Copy URL</button>
                        </div>
                    </div>
                    <div class="uadbp-player-filters-panel" id="uadbp-filters-panel" style="display:none;">
                        <div class="uadbp-filter-row">
                            <label>Brightness</label>
                            <input type="range" id="uadbp-filter-brightness" min="0" max="200" value="100">
                            <span id="uadbp-filter-brightness-val">100%</span>
                        </div>
                        <div class="uadbp-filter-row">
                            <label>Contrast</label>
                            <input type="range" id="uadbp-filter-contrast" min="0" max="200" value="100">
                            <span id="uadbp-filter-contrast-val">100%</span>
                        </div>
                        <div class="uadbp-filter-row">
                            <label>Saturation</label>
                            <input type="range" id="uadbp-filter-saturate" min="0" max="200" value="100">
                            <span id="uadbp-filter-saturate-val">100%</span>
                        </div>
                        <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-reset-filters">Reset Filters</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            this.modal = modal;
            this.video = document.getElementById('uadbp-video-element');
            this.bindEvents();
            return modal;
        }

        bindEvents() {
            const modal = this.modal;
            if (!modal) return;

            modal.querySelector('#uadbp-player-close').onclick = () => this.close();
            modal.onclick = (e) => { if (e.target === modal) this.close(); };

            // PiP
            modal.querySelector('#uadbp-pip').onclick = () => {
                if (this.video && document.pictureInPictureEnabled) {
                    this.video.requestPictureInPicture().catch(() => { });
                }
            };

            // Screenshot
            modal.querySelector('#uadbp-screenshot').onclick = () => this.takeScreenshot();

            // Fullscreen
            modal.querySelector('#uadbp-fullscreen').onclick = () => {
                const container = modal.querySelector('.uadbp-player-video-container');
                if (Utils.nativeRequestFullscreen) {
                    Utils.nativeRequestFullscreen.call(container).catch(() => { });
                } else {
                    const req = container.requestFullscreen || container.webkitRequestFullscreen || container.mozRequestFullScreen || container.msRequestFullscreen;
                    if (req) req.call(container).catch(() => { });
                }
            };

            // Speed
            modal.querySelector('#uadbp-speed-select').onchange = (e) => {
                if (this.video) this.video.playbackRate = parseFloat(e.target.value);
            };

            // Filters toggle
            modal.querySelector('#uadbp-player-filters').onclick = () => {
                const panel = modal.querySelector('#uadbp-filters-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            };

            // Filter sliders
            ['brightness', 'contrast', 'saturate'].forEach(filter => {
                const slider = modal.querySelector(`#uadbp-filter-${filter}`);
                const valDisplay = modal.querySelector(`#uadbp-filter-${filter}-val`);
                slider.oninput = () => {
                    this.filters[filter] = slider.value;
                    valDisplay.textContent = slider.value + '%';
                    this.applyFilters();
                };
            });

            modal.querySelector('#uadbp-reset-filters').onclick = () => this.resetFilters();

            // Keyboard shortcuts
            modal.onkeydown = (e) => {
                if (!this.video) return;
                switch (e.key) {
                    case ' ':
                        e.preventDefault();
                        this.video.paused ? this.video.play() : this.video.pause();
                        break;
                    case 'ArrowLeft':
                        this.video.currentTime -= 5;
                        break;
                    case 'ArrowRight':
                        this.video.currentTime += 5;
                        break;
                    case 'ArrowUp':
                        this.video.volume = Math.min(1, this.video.volume + 0.1);
                        break;
                    case 'ArrowDown':
                        this.video.volume = Math.max(0, this.video.volume - 0.1);
                        break;
                    case 'f':
                        modal.querySelector('#uadbp-fullscreen').click();
                        break;
                    case 'm':
                        this.video.muted = !this.video.muted;
                        break;
                }
            };
        }

        applyFilters() {
            if (!this.video) return;
            this.video.style.filter = `brightness(${this.filters.brightness}%) contrast(${this.filters.contrast}%) saturate(${this.filters.saturate}%)`;
        }

        resetFilters() {
            this.filters = { brightness: 100, contrast: 100, saturate: 100 };
            ['brightness', 'contrast', 'saturate'].forEach(f => {
                const slider = this.modal?.querySelector(`#uadbp-filter-${f}`);
                const val = this.modal?.querySelector(`#uadbp-filter-${f}-val`);
                if (slider) slider.value = 100;
                if (val) val.textContent = '100%';
            });
            if (this.video) this.video.style.filter = '';
        }

        takeScreenshot() {
            if (!this.video || !this.video.videoWidth) {
                Utils.notify('No video playing to screenshot', 'warning');
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `screenshot_${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
                logger.log('Screenshot saved', 'success');
            });
        }

        async play(url, callbacks = {}) {
            this.currentUrl = url;
            this.createModal();

            const overlay = document.getElementById('uadbp-player-overlay');
            const status = document.getElementById('uadbp-player-status');
            const qualitySelect = document.getElementById('uadbp-quality-select');

            overlay.style.display = 'flex';
            this.modal.classList.add('show');
            status.textContent = Utils.extractDomain(url);

            // Download button
            document.getElementById('uadbp-player-download').onclick = () => {
                if (callbacks.onDownload) callbacks.onDownload(url);
            };

            // Commands button
            document.getElementById('uadbp-player-commands').onclick = () => {
                if (callbacks.onCommands) callbacks.onCommands(url);
            };

            // Copy URL
            document.getElementById('uadbp-player-copy').onclick = () => {
                this.copyToClipboard(url);
            };

            try {
                if (url.includes('.m3u8')) {
                    await this.playHLS(url, overlay, qualitySelect);
                } else if (url.includes('.mpd')) {
                    await this.playDASH(url, overlay);
                } else {
                    this.video.src = url;
                    this.setupVideoEvents(overlay);
                }
            } catch (e) {
                this.showError(overlay, e.message);
            }
        }

        async playHLS(url, overlay, qualitySelect) {
            const audioSelect = document.getElementById('uadbp-audio-select');
            const subSelect = document.getElementById('uadbp-subtitle-select');

            if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                if (this.hls) this.hls.destroy();

                this.hls = new Hls({ debug: false, enableWorker: true });

                this.hls.loadSource(url);
                this.hls.attachMedia(this.video);

                this.hls.on(Hls.Events.MANIFEST_PARSED, (e, data) => {
                    overlay.style.display = 'none';
                    this.video.play().catch(() => { });

                    // Quality
                    if (data.levels?.length > 1) {
                        qualitySelect.innerHTML = '<option value="-1">Auto</option>';
                        data.levels.forEach((level, i) => {
                            const opt = document.createElement('option');
                            opt.value = i;
                            opt.textContent = `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`;
                            qualitySelect.appendChild(opt);
                        });
                        qualitySelect.onchange = () => this.hls.currentLevel = parseInt(qualitySelect.value);
                    }

                    // Audio
                    if (this.hls.audioTracks?.length > 1) {
                        audioSelect.innerHTML = '';
                        this.hls.audioTracks.forEach((t, i) => {
                            const opt = document.createElement('option');
                            opt.value = i;
                            opt.textContent = t.name || `Audio ${i + 1}`;
                            audioSelect.appendChild(opt);
                        });
                        audioSelect.onchange = () => this.hls.audioTrack = parseInt(audioSelect.value);
                    }

                    // Subtitles
                    if (this.hls.subtitleTracks?.length > 0) {
                        subSelect.innerHTML = '<option value="-1">Off</option>';
                        this.hls.subtitleTracks.forEach((t, i) => {
                            const opt = document.createElement('option');
                            opt.value = i;
                            opt.textContent = t.name || `Subtitle ${i + 1}`;
                            subSelect.appendChild(opt);
                        });
                        subSelect.onchange = () => this.hls.subtitleTrack = parseInt(subSelect.value);
                    }
                });

                this.hls.on(Hls.Events.ERROR, (e, data) => {
                    if (data.fatal) this.showError(overlay, 'Stream error. Try downloading.');
                });

            } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
                this.video.src = url;
                this.setupVideoEvents(overlay);
            } else {
                throw new Error('HLS not supported');
            }
        }

        async playDASH(url, overlay) {
            if (typeof dashjs !== 'undefined') {
                if (this.dash) this.dash.reset();

                this.dash = dashjs.MediaPlayer().create();
                this.dash.initialize(this.video, url, true);

                this.dash.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
                    overlay.style.display = 'none';
                    this.video.play().catch(() => { });

                    // Quality Selection
                    const qualitySelect = document.getElementById('uadbp-quality-select');
                    const bitrates = this.dash.getBitrateInfoListFor('video');
                    if (qualitySelect && bitrates && bitrates.length > 1) {
                        qualitySelect.innerHTML = '<option value="-1">Auto</option>';
                        bitrates.forEach((b, i) => {
                            const opt = document.createElement('option');
                            opt.value = i;
                            opt.textContent = `${b.height}p (${Math.round(b.bitrate / 1000)}k)`;
                            qualitySelect.appendChild(opt);
                        });
                        qualitySelect.onchange = () => {
                            const val = parseInt(qualitySelect.value);
                            const settings = { 'streaming': { 'abr': { 'autoSwitchBitrate': { 'video': val === -1 } } } };
                            this.dash.updateSettings(settings);
                            if (val !== -1) this.dash.setQualityFor('video', val);
                        };
                    }
                });

                this.dash.on(dashjs.MediaPlayer.events.ERROR, (e) => {
                    this.showError(overlay, e.error?.message || 'DASH playback error');
                });
            } else {
                throw new Error('DASH.js not loaded');
            }
        }

        setupVideoEvents(overlay) {
            this.video.onloadedmetadata = () => {
                overlay.style.display = 'none';
                this.video.play().catch(() => { });
            };

            this.video.onerror = () => {
                this.showError(overlay, 'Cannot play directly (CORS/403). Use Download instead.');
            };

            // (NEW) Gesture Controls
            if (CONFIG.features.gestureControls) {
                const container = document.getElementById('uadbp-video-container');
                container.addEventListener('dblclick', () => {
                    if (document.fullscreenElement) document.exitFullscreen();
                    else container.requestFullscreen().catch(() => { });
                });
                container.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    this.video.volume = Math.min(Math.max(this.video.volume - Math.sign(e.deltaY) * 0.1, 0), 1);
                    // Show volume feedback?
                }, { passive: false });
            }
        }

        showError(overlay, message) {
            overlay.style.display = 'flex';
            overlay.innerHTML = `
                <div style="text-align:center">
                    <div style="font-size:48px;margin-bottom:16px">🔒</div>
                    <div style="color:#ff4444;font-size:14px">${message}</div>
                    <div style="margin-top:16px;color:#00ff88;font-size:12px">Use the Download button to save the video</div>
                </div>
            `;
        }

        copyToClipboard(text) {
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
                logger.log('Copied to clipboard!', 'success');
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    logger.log('Copied to clipboard!', 'success');
                }).catch(() => prompt('Copy:', text));
            }
        }

        close() {
            if (this.hls) { this.hls.destroy(); this.hls = null; }
            if (this.dash) { this.dash.reset(); this.dash = null; }
            if (this.video) { this.video.pause(); this.video.src = ''; }
            if (this.modal) {
                this.modal.classList.remove('show');
                setTimeout(() => this.modal?.remove(), 300);
            }
            this.currentUrl = null;
        }
    }

    const videoPlayer = new VideoPlayer();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██╗   ██╗██╗    ██████╗  █████╗ ███╗   ██╗███████╗██╗     
    // ██║   ██║██║    ██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     
    // ██║   ██║██║    ██████╔╝███████║██╔██╗ ██║█████╗  ██║     
    // ██║   ██║██║    ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  ██║     
    // ╚██████╔╝██║    ██║     ██║  ██║██║ ╚████║███████╗███████╗
    //  ╚═════╝ ╚═╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
    // ═══════════════════════════════════════════════════════════════════════════════

    class UIPanel {
        constructor() {
            this.panel = null;
            this.floatBtn = null;
            this.visible = true;
            this.minimized = false;
            this.activeTab = 'status';
        }

        init() {
            if (!STATE.isMainFrame) return;
            this.injectStyles();
            this.createPanel();
            this.createFloatButton();
            this.bindEvents();
            this.bindHotkeys();
            this.setupEventListeners();
            this.registerMenuCommands();
            setTimeout(() => this.updateUI(), 500);

            // (FIX) Use pagehide instead of unload to avoid permission violation
            window.addEventListener('pagehide', () => {
                this.closeModal();
                if (this.panel) this.panel.remove();
            });
        }

        // (FIX) Trusted Types Helper
        createTrustedHTML(html) {
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                if (!this.ttPolicy) {
                    try {
                        this.ttPolicy = window.trustedTypes.createPolicy('uadbpPolicy', {
                            createHTML: (string) => string
                        });
                    } catch (e) {
                        // Policy might already exist
                        this.ttPolicy = window.trustedTypes.defaultPolicy || { createHTML: s => s };
                    }
                }
                return this.ttPolicy.createHTML(html);
            }
            return html;
        }

        injectStyles() {
            const Z = 2147483647;
            const css = `
                :root {
                    --uadbp-primary: #ff3366;
                    --uadbp-secondary: #ff0044;
                    --uadbp-bg: #0a0a0a;
                    --uadbp-surface: #141414;
                    --uadbp-border: rgba(255, 51, 102, 0.3);
                    --uadbp-text: #e0e0e0;
                    --uadbp-text-dim: #888;
                }
                #uadbp-panel, #uadbp-float, .uadbp-modal { font-family: 'Segoe UI', system-ui, sans-serif; box-sizing: border-box; }
                #uadbp-panel { position: fixed !important; top: 10px; left: 10px; width: 440px; max-height: 85vh; background: linear-gradient(180deg, var(--uadbp-bg), #1a050a); border: 1px solid var(--uadbp-border); border-radius: 14px; color: var(--uadbp-text); font-size: 12px; z-index: ${Z} !important; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9); overflow: hidden; backdrop-filter: blur(10px); }
                #uadbp-panel.hidden { opacity: 0; pointer-events: none; transform: scale(0.95); transition: 0.2s; }
                #uadbp-panel.minimized .uadbp-tabs, #uadbp-panel.minimized .uadbp-content { display: none !important; }
                
                .uadbp-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: linear-gradient(90deg, rgba(255, 51, 102, 0.1), transparent); border-bottom: 1px solid var(--uadbp-border); cursor: grab; }
                .uadbp-logo { display: flex; align-items: center; gap: 10px; }
                .uadbp-logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--uadbp-primary), var(--uadbp-secondary)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 0 10px rgba(255, 51, 102, 0.4); }
                .uadbp-title { font-size: 15px; font-weight: 800; background: linear-gradient(90deg, #ff3366, #ff88aa); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 0.5px; }
                .uadbp-subtitle{font-size:9px;color:#666}
                .uadbp-header-btns{display:flex;gap:4px}
                .uadbp-hdr-btn{width:24px;height:24px;border:none;border-radius:5px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:.2s}
                .uadbp-hdr-btn:hover{background:rgba(255, 51, 102, .3)}
                .uadbp-hdr-btn.close:hover{background:rgba(255,68,68,.5)}
                .uadbp-tabs{display:flex;background:rgba(0,0,0,.4);border-bottom:1px solid #1a1a2e}
                .uadbp-tab{flex:1;padding:8px;text-align:center;cursor:pointer;font-size:10px;font-weight:600;color:#666;border-bottom:2px solid transparent;transition:.2s}
                .uadbp-tab:hover{color:var(--uadbp-primary);background:rgba(255, 51, 102, .05)}
                .uadbp-tab.active{color:var(--uadbp-primary);border-bottom-color:var(--uadbp-primary);background:rgba(255, 51, 102, .08)}
                .uadbp-content{max-height:calc(80vh - 90px);overflow-y:auto;padding:12px}
                .uadbp-content::-webkit-scrollbar{width:4px}
                .uadbp-content::-webkit-scrollbar-thumb{background:rgba(255, 51, 102, .3);border-radius:2px}
                .uadbp-tab-panel{display:none}
                .uadbp-tab-panel.active{display:block}
                .uadbp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px}
                .uadbp-stat{background:rgba(255, 51, 102, .05);border:1px solid rgba(255, 51, 102, .15);border-radius:8px;padding:10px 6px;text-align:center}
                .uadbp-stat-val{font-size:18px;font-weight:700;color:var(--uadbp-primary)}
                .uadbp-stat-lbl{font-size:8px;color:#888;margin-top:2px;text-transform:uppercase}
                .uadbp-section{margin-bottom:14px}
                .uadbp-section-title{font-size:9px;font-weight:700;color:var(--uadbp-primary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255, 51, 102, .2)}
                .uadbp-btns{display:flex;gap:6px;flex-wrap:wrap}
                .uadbp-btn{flex:1;min-width:80px;padding:8px 10px;border:none;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:4px}
                .uadbp-btn-primary{background:linear-gradient(135deg, var(--uadbp-primary), var(--uadbp-secondary));color:#fff;box-shadow:0 2px 8px rgba(255, 51, 102, .3)}
                .uadbp-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(255, 51, 102, .4)}
                .uadbp-btn-secondary{background:rgba(255,255,255,.06);color:#ddd;border:1px solid #333}
                .uadbp-btn-secondary:hover{border-color:var(--uadbp-primary);color:var(--uadbp-primary)}
                .uadbp-btn-danger{background:linear-gradient(135deg,#ff4444,#bb0000);color:#fff}
                .uadbp-btn-sm{padding:6px 8px;font-size:9px;min-width:60px}
                .uadbp-media-list{max-height:280px;overflow-y:auto}
                .uadbp-media-item{background:rgba(0,0,0,.4);border:1px solid #222;border-left:3px solid var(--uadbp-primary);border-radius:6px;padding:10px;margin-bottom:8px}
                .uadbp-media-item.hls{border-left-color:#00ddff}
                .uadbp-media-item.dash{border-left-color:#ff6b6b}
                .uadbp-media-tags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px}
                .uadbp-tag{padding:2px 6px;border-radius:3px;font-size:8px;font-weight:700;text-transform:uppercase}
                .uadbp-tag-hls{background:#00ddff;color:#000}
                .uadbp-tag-dash{background:#ff6b6b;color:#000}
                .uadbp-tag-video{background:#aa88ff;color:#000}
                .uadbp-tag-quality{background:#444;color:#ddd}
                .uadbp-media-url{font-size:9px;color:#888;word-break:break-all;cursor:pointer;padding:6px;background:rgba(0,0,0,.3);border-radius:3px;margin:6px 0;font-family:monospace;max-height:40px;overflow:hidden}
                .uadbp-media-url:hover{background:rgba(255, 51, 102, .1);color:var(--uadbp-primary)}
                .uadbp-media-actions{display:flex;gap:4px;flex-wrap:wrap}
                .uadbp-media-btn{padding:4px 8px;border:1px solid #333;border-radius:4px;background:rgba(255,255,255,.04);color:#bbb;font-size:9px;cursor:pointer;transition:.2s}
                .uadbp-media-btn:hover{background:var(--uadbp-primary);color:#fff;border-color:var(--uadbp-primary)}
                .uadbp-input{width:100%;padding:8px 10px;border:1px solid #333;border-radius:6px;background:rgba(0,0,0,.4);color:#fff;font-size:11px;margin-bottom:8px}
                .uadbp-input:focus{outline:none;border-color:var(--uadbp-primary)}
                .uadbp-progress{background:#1a1a2e;border-radius:8px;padding:10px;margin:10px 0;border:1px solid rgba(255, 51, 102, .2);display:none}
                .uadbp-progress.active{display:block}
                .uadbp-progress-bar{height:14px;background:#1a1a2e;border-radius:7px;overflow:hidden}
                .uadbp-progress-fill{height:100%;background:linear-gradient(90deg, var(--uadbp-primary), var(--uadbp-secondary));width:0%;transition:width .3s}
                .uadbp-progress-text{text-align:center;font-size:10px;margin-top:6px;color:#888}
                .uadbp-logs{max-height:200px;overflow-y:auto;background:rgba(0,0,0,.5);border-radius:6px;padding:8px;font-family:monospace;font-size:9px}
                .uadbp-log{padding:4px 6px;margin-bottom:2px;border-radius:3px}
                .uadbp-log-info{background:rgba(255, 51, 102, .06);color:var(--uadbp-primary)}
                .uadbp-log-success{background:rgba(0,255,0,.08);color:#00ff00}
                .uadbp-log-warning{background:rgba(255,170,0,.08);color:#ffaa00}
                .uadbp-log-error{background:rgba(255,68,68,.1);color:#ff4444}
                .uadbp-empty{text-align:center;padding:30px 15px;color:#555}
                .uadbp-empty-icon{font-size:36px;margin-bottom:8px}
                #uadbp-float{position:fixed!important;bottom:20px;right:20px;width:50px;height:50px;background:linear-gradient(135deg, var(--uadbp-primary), var(--uadbp-secondary));border-radius:50%;display:none;align-items:center;justify-content:center;font-size:20px;cursor:pointer;z-index:${Z}!important;box-shadow:0 4px 20px rgba(255, 51, 102, .5);border:2px solid rgba(255,255,255,.2)}
                #uadbp-float:hover{transform:scale(1.1)}
                #uadbp-float.show{display:flex!important}
                .uadbp-badge{position:absolute;top:-4px;right:-4px;background:#fff;color:var(--uadbp-primary);font-weight:bold;font-size:10px;min-width:18px;height:18px;border-radius:9px;display:none;align-items:center;justify-content:center;padding:0 4px}
                .uadbp-badge.show{display:flex}
                .uadbp-modal{position:fixed!important;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:${Z + 1}!important;padding:20px}
                .uadbp-modal.show{display:flex!important}
                .uadbp-modal-content{background:linear-gradient(180deg,#12121f,#0a0a12);border:1px solid rgba(255, 51, 102, .4);border-radius:14px;max-width:600px;width:100%;max-height:75vh;overflow-y:auto}
                .uadbp-modal-header{padding:12px 16px;border-bottom:1px solid #222;display:flex;justify-content:space-between;align-items:center}
                .uadbp-modal-title{font-size:14px;font-weight:700;color:var(--uadbp-primary)}
                .uadbp-modal-body{padding:16px}
                .uadbp-code{background:#0a0a0a;border:1px solid #222;border-radius:5px;padding:10px;font-family:monospace;font-size:9px;color:var(--uadbp-primary);overflow-x:auto;white-space:pre-wrap;word-break:break-all;max-height:80px;overflow-y:auto;cursor:pointer;margin-bottom:10px}
                .uadbp-code:hover{border-color:var(--uadbp-primary)}
                .uadbp-player-content{max-width:800px;padding:0}
                .uadbp-player-header{background:#0a0a12;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222}
                .uadbp-player-title{color:var(--uadbp-primary);font-weight:600;font-size:12px}
                .uadbp-player-header-btns{display:flex;gap:4px}
                .uadbp-player-btn{width:24px;height:24px;border:none;border-radius:5px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
                .uadbp-player-btn:hover{background:rgba(255, 51, 102, .3)}
                .uadbp-player-btn.close:hover{background:rgba(255,68,68,.5)}
                .uadbp-player-video-container{background:#000;position:relative;min-height:250px}
                .uadbp-player-video-container video{width:100%;max-height:60vh;display:block}
                .uadbp-player-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-size:12px;gap:10px}
                .uadbp-player-loader{width:32px;height:32px;border:3px solid #333;border-top-color:var(--uadbp-primary);border-radius:50%;animation:uadbpSpin 1s linear infinite}
                @keyframes uadbpSpin{to{transform:rotate(360deg)}}
                @keyframes uadbpSlideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
                .uadbp-media-item{animation:uadbpSlideIn 0.3s ease-out;background:rgba(0,0,0,.4);border:1px solid #222;border-left:3px solid var(--uadbp-primary);border-radius:6px;padding:10px;margin-bottom:8px}
                .uadbp-player-controls{background:#0a0a12;padding:10px 12px;border-top:1px solid #222}
                .uadbp-player-info{display:flex;align-items:center;gap:8px;margin-bottom:8px}
                .uadbp-player-status{font-size:10px;color:#888}
                .uadbp-player-toolbar{display:flex;gap:6px;flex-wrap:wrap}
                .uadbp-select{padding:6px 8px;border:1px solid #333;border-radius:5px;background:rgba(0,0,0,.4);color:#fff;font-size:10px;cursor:pointer}
                .uadbp-player-filters-panel{background:rgba(0,0,0,.4);padding:10px;border-top:1px solid #222}
                .uadbp-filter-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
                .uadbp-filter-row label{width:70px;font-size:10px;color:#888}
                .uadbp-filter-row input{flex:1}
                .uadbp-filter-row span{width:40px;font-size:10px;color:var(--uadbp-primary)}
            `;
            if (typeof GM_addStyle !== 'undefined') GM_addStyle(css);
            else {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
            }
        }

        createTrustedHTML(html) {
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                if (!this.ttPolicy) {
                    try {
                        this.ttPolicy = window.trustedTypes.createPolicy('uadbpPolicy', {
                            createHTML: (string) => string
                        });
                    } catch (e) {
                        this.ttPolicy = window.trustedTypes.defaultPolicy || { createHTML: s => s };
                    }
                }
                return this.ttPolicy.createHTML(html);
            }
            return html;
        }

        createPanel() {
            document.getElementById('uadbp-panel')?.remove();
            const p = document.createElement('div');
            p.id = 'uadbp-panel';
            if (CONFIG.ui.compactMode) p.classList.add('compact');

            const htmlContent = `
                <div class="uadbp-header" id="uadbp-drag">
                    <div class="uadbp-logo">
                        <div class="uadbp-logo-icon">⚡</div>
                        <div class="uadbp-title">
                            UADBP
                            <div class="uadbp-subtitle">
                                <span id="uadbp-rec-status" style="display:none;color:#ff3366;font-weight:bold;margin-right:5px;">🔴 REC <span id="uadbp-rec-timer">0:00</span></span>
                                Ultimate Edition
                            </div>
                        </div>
                    </div>
                    <div class="uadbp-header-btns">
                        <button class="uadbp-hdr-btn" id="uadbp-minimize">─</button>
                        <button class="uadbp-hdr-btn close" id="uadbp-hide">✕</button>
                    </div>
                </div>
                <div class="uadbp-tabs" id="uadbp-tabs">
                    <div class="uadbp-tab active" data-tab="status">📊 Status</div>
                    <div class="uadbp-tab" data-tab="media">📥 Media <span id="uadbp-count-tab"></span></div>
                    <div class="uadbp-tab" data-tab="download">⬇️ Download</div>
                    <div class="uadbp-tab" data-tab="logs">📝 Logs</div>
                    <div class="uadbp-tab" data-tab="settings">⚙️ Settings</div>
                </div>
                <div class="uadbp-content">
                    <div class="uadbp-tab-panel active" data-panel="status">
                        <div class="uadbp-stats">
                            <div class="uadbp-stat"><div class="uadbp-stat-val" id="uadbp-s-cap">0</div><div class="uadbp-stat-lbl">Captured</div></div>
                            <div class="uadbp-stat"><div class="uadbp-stat-val" id="uadbp-s-byp">0</div><div class="uadbp-stat-lbl">Bypassed</div></div>
                            <div class="uadbp-stat"><div class="uadbp-stat-val" id="uadbp-s-dl">0</div><div class="uadbp-stat-lbl">Downloads</div></div>
                            <div class="uadbp-stat"><div class="uadbp-stat-val" id="uadbp-s-err">0</div><div class="uadbp-stat-lbl">Errors</div></div>
                            <div class="uadbp-stat"><div class="uadbp-stat-val" id="uadbp-s-req">0</div><div class="uadbp-stat-lbl">Requests</div></div>
                            <div class="uadbp-stat"><div class="uadbp-stat-val" id="uadbp-s-data">0 B</div><div class="uadbp-stat-lbl">Data In</div></div>
                        </div>
                        <div class="uadbp-section"><div class="uadbp-section-title">🔒 Protection</div>
                            <div style="font-size:10px;color:#888;padding:6px;">✓ Anti-Debug Active ✓ Headers Captured ✓ Network Monitored</div>
                        </div>
                        <div style="font-size:10px;color:#666;text-align:center;padding:5px;">🛡️ Auto-Scanning Active</div>
                    </div>
                    <div class="uadbp-tab-panel" data-panel="media">
                        <input type="text" class="uadbp-input" id="uadbp-search" placeholder="🔍 Search URLs...">
                        <div class="uadbp-btns" style="margin-bottom:10px;">
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-primary" id="uadbp-rec-screen">🎥 Record Screen</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-rec-video">🎬 Record Video</button>
                        </div>
                        <div class="uadbp-btns" style="margin-bottom:10px;">
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-export-json">📄 JSON</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-export-m3u">🎵 M3U</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-export-curl">📋 cURL</button>
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-danger" id="uadbp-clear">🗑️</button>
                        </div>
                        <div class="uadbp-section-title">📥 Captured (<span id="uadbp-count">0</span>)</div>
                        <div class="uadbp-media-list" id="uadbp-media-list">
                            <div class="uadbp-empty"><div class="uadbp-empty-icon">📡</div><div>No media captured yet</div></div>
                        </div>
                    </div>
                    <div class="uadbp-tab-panel" data-panel="download">
                        <div class="uadbp-progress" id="uadbp-progress">
                            <div class="uadbp-progress-bar"><div class="uadbp-progress-fill" id="uadbp-prog-fill"></div></div>
                            <div class="uadbp-progress-text" id="uadbp-prog-text">0%</div>
                        </div>
                        <div class="uadbp-btns" style="margin-bottom:10px;">
                            <button class="uadbp-btn uadbp-btn-primary" id="uadbp-dl-best">⬇️ Download Best HLS</button>
                            <button class="uadbp-btn uadbp-btn-secondary" id="uadbp-dl-pause" style="display:none;">⏸️ Pause</button>
                            <button class="uadbp-btn uadbp-btn-secondary" id="uadbp-dl-cancel" style="display:none;">❌ Cancel</button>
                        </div>
                        <div class="uadbp-btns">
                            <button class="uadbp-btn uadbp-btn-secondary" id="uadbp-play">▶️ Play Video</button>
                            <button class="uadbp-btn uadbp-btn-secondary" id="uadbp-quality">🎬 Quality Select</button>
                        </div>
                    </div>
                    <div class="uadbp-tab-panel" data-panel="logs">
                        <div class="uadbp-btns" style="margin-bottom:8px;">
                            <button class="uadbp-btn uadbp-btn-sm uadbp-btn-secondary" id="uadbp-clear-logs">🗑️ Clear</button>
                        </div>
                        <div class="uadbp-logs" id="uadbp-logs"><div class="uadbp-log uadbp-log-info">UADBP v${CONFIG.version} ready</div></div>
                    </div>
                    <div class="uadbp-tab-panel" data-panel="settings">
                        <div class="uadbp-section-title">🛡️ Protection & Bypasses</div>
                        <div class="uadbp-settings-group">
                            ${['debuggerBypass', 'devToolsProtection', 'consoleProtection', 'sourceProtection', 'timingProtection', 'fullscreenBypass', 'antiVM'].map(k => `
                                <div class="uadbp-switch-row">
                                    <span class="uadbp-switch-label">${k}</span>
                                    <label class="uadbp-switch">
                                        <input type="checkbox" id="uadbp-cfg-${k}" ${CONFIG.features[k] ? 'checked' : ''}>
                                        <span class="uadbp-slider"></span>
                                    </label>
                                </div>
                            `).join('')}
                        </div>

                        <div class="uadbp-section-title">📥 Capture & Download</div>
                        <div class="uadbp-settings-group">
                             ${['networkIntercept', 'blobCapture', 'hlsDownload', 'dashDownload', 'autoScan', 'deepScan'].map(k => `
                                <div class="uadbp-switch-row">
                                    <span class="uadbp-switch-label">${k}</span>
                                    <label class="uadbp-switch">
                                        <input type="checkbox" id="uadbp-cfg-${k}" ${CONFIG.features[k] ? 'checked' : ''}>
                                        <span class="uadbp-slider"></span>
                                    </label>
                                </div>
                            `).join('')}
                             <div class="uadbp-switch-row">
                                <span class="uadbp-switch-label">Max Parallel Downloads</span>
                                <input type="number" id="uadbp-cfg-dl-max" value="${CONFIG.download.maxConcurrent}" min="1" max="16" style="width:50px;background:#222;color:#fff;border:1px solid #444;border-radius:4px;padding:3px;text-align:center;">
                             </div>
                        </div>

                        <div class="uadbp-section-title">⚙️ System & UI</div>
                        <div class="uadbp-settings-group">
                             <div class="uadbp-switch-row">
                                <span class="uadbp-switch-label">Dark Theme</span>
                                <label class="uadbp-switch">
                                    <input type="checkbox" id="uadbp-cfg-ui-theme" ${CONFIG.ui.theme === 'dark' ? 'checked' : ''}>
                                    <span class="uadbp-slider"></span>
                                </label>
                             </div>
                             <div class="uadbp-switch-row">
                                <span class="uadbp-switch-label">Compact Mode</span>
                                <label class="uadbp-switch">
                                    <input type="checkbox" id="uadbp-cfg-ui-compact" ${CONFIG.ui.compactMode ? 'checked' : ''}>
                                    <span class="uadbp-slider"></span>
                                </label>
                             </div>
                             <div class="uadbp-switch-row">
                                <span class="uadbp-switch-label">Show Notifications</span>
                                <label class="uadbp-switch">
                                    <input type="checkbox" id="uadbp-cfg-ui-notif" ${CONFIG.ui.showNotifications ? 'checked' : ''}>
                                    <span class="uadbp-slider"></span>
                                </label>
                             </div>
                             <div class="uadbp-switch-row">
                                <span class="uadbp-switch-label">Auto-Save Media</span>
                                <label class="uadbp-switch">
                                    <input type="checkbox" id="uadbp-cfg-store-auto" ${CONFIG.storage.autoSave ? 'checked' : ''}>
                                    <span class="uadbp-slider"></span>
                                </label>
                             </div>
                             <div class="uadbp-switch-row">
                                <span class="uadbp-switch-label">Active Proxy</span>
                                <select id="uadbp-cfg-proxy" style="background:#222;color:#fff;border:1px solid #444;border-radius:4px;padding:3px;max-width:140px;">
                                     ${CONFIG.proxy.servers.map((s, i) => `<option value="${i}" ${CONFIG.proxy.currentIndex === i ? 'selected' : ''}>${s.substring(0, 25)}...</option>`).join('')}
                                </select>
                             </div>
                        </div>
                        
                        <div class="uadbp-btns" style="margin-top:15px;border-top:1px solid #333;padding-top:10px;">
                            <button class="uadbp-btn uadbp-btn-primary" id="uadbp-save-cfg">💾 Save Settings</button>
                            <button class="uadbp-btn uadbp-btn-secondary" id="uadbp-reset-cfg">🔄 Reset</button>
                        </div>
                    </div>
                </div>`;

            p.innerHTML = this.createTrustedHTML(htmlContent);
            document.body.appendChild(p);
            this.panel = p;
        }

        createFloatButton() {
            document.getElementById('uadbp-float')?.remove();
            const btn = document.createElement('button');
            btn.id = 'uadbp-float';
            btn.innerHTML = this.createTrustedHTML('📥<span class="uadbp-badge" id="uadbp-badge">0</span>');
            document.body.appendChild(btn);
            this.floatBtn = btn;
        }

        bindEvents() {
            const p = this.panel;
            if (!p) return;

            // Tabs
            p.querySelectorAll('.uadbp-tab').forEach(t => t.onclick = () => this.showTab(t.dataset.tab));

            // Header buttons
            document.getElementById('uadbp-minimize')?.addEventListener('click', () => p.classList.toggle('minimized'));
            document.getElementById('uadbp-hide')?.addEventListener('click', () => this.toggleVisibility());

            // Float button
            this.floatBtn?.addEventListener('click', () => { this.visible = true; p.classList.remove('hidden'); this.showTab('media'); });

            // Dragging
            this.setupDrag();

            // Actions
            document.getElementById('uadbp-scan')?.addEventListener('click', () => { mediaCapture.scanDOM(); this.updateUI(); });
            document.getElementById('uadbp-refresh')?.addEventListener('click', () => this.updateUI());
            document.getElementById('uadbp-search')?.addEventListener('input', () => this.filterMedia());
            document.getElementById('uadbp-clear')?.addEventListener('click', () => { if (confirm('Clear all?')) mediaCapture.clear(); });
            document.getElementById('uadbp-export-json')?.addEventListener('click', () => this.showExport('JSON', mediaCapture.exportJSON()));
            document.getElementById('uadbp-export-m3u')?.addEventListener('click', () => this.showExport('M3U', mediaCapture.exportM3U()));
            document.getElementById('uadbp-export-curl')?.addEventListener('click', () => this.showExport('cURL', this.generateAllCurl()));
            document.getElementById('uadbp-dl-best')?.addEventListener('click', () => this.downloadBest());
            document.getElementById('uadbp-dl-cancel')?.addEventListener('click', () => hlsDownloader.cancelDownload(this.currentDownloadId));
            document.getElementById('uadbp-dl-pause')?.addEventListener('click', () => {
                const dl = hlsDownloader.getDownload(this.currentDownloadId);
                if (dl) dl.paused ? hlsDownloader.resumeDownload(this.currentDownloadId) : hlsDownloader.pauseDownload(this.currentDownloadId);
            });
            document.getElementById('uadbp-play')?.addEventListener('click', () => this.playBest());
            document.getElementById('uadbp-quality')?.addEventListener('click', () => this.showQualityModal());
            document.getElementById('uadbp-clear-logs')?.addEventListener('click', () => { logger.clear(); this.updateLogs(); });
            document.getElementById('uadbp-rec-screen').onclick = () => {
                if (streamRecorder.isRecording) streamRecorder.stop();
                else streamRecorder.start();
            };
            document.getElementById('uadbp-rec-video').onclick = () => {
                if (streamRecorder.isRecording) { streamRecorder.stop(); return; }
                const video = document.querySelector('video');
                if (video) streamRecorder.start(video);
                CONFIG.ui.showNotifications = document.getElementById('uadbp-cfg-ui-notif').checked;
                CONFIG.storage.autoSave = document.getElementById('uadbp-cfg-store-auto').checked;

                const maxDl = document.getElementById('uadbp-cfg-dl-max');
                if (maxDl) CONFIG.download.maxConcurrent = parseInt(maxDl.value) || 4;

                const proxySel = document.getElementById('uadbp-cfg-proxy');
                if (proxySel) CONFIG.proxy.currentIndex = parseInt(proxySel.value);

                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue('uadbp_config_features', JSON.stringify(CONFIG.features));
                    GM_setValue('uadbp_config_ui', JSON.stringify(CONFIG.ui));
                    GM_setValue('uadbp_config_dl', JSON.stringify({ maxConcurrent: CONFIG.download.maxConcurrent }));
                    GM_setValue('uadbp_config_proxy', JSON.stringify({ currentIndex: CONFIG.proxy.currentIndex, servers: CONFIG.proxy.servers }));
                    GM_setValue('uadbp_config_storage', JSON.stringify(CONFIG.storage));
                }
                logger.log('Settings saved. Reloading...', 'success');
                setTimeout(() => location.reload(), 1000);
            };

            document.getElementById('uadbp-reset-cfg').onclick = () => {
                if (confirm('Reset all settings to default?')) {
                    if (typeof GM_deleteValue !== 'undefined') {
                        GM_deleteValue('uadbp_config_features');
                        GM_deleteValue('uadbp_config_ui');
                        GM_deleteValue('uadbp_config_dl');
                        GM_deleteValue('uadbp_config_proxy');
                    }
                    location.reload();
                }
            };
        }

        setupDrag() {
            const handle = document.getElementById('uadbp-drag');
            const panel = this.panel;
            if (!handle || !panel) return;

            // Restore position
            if (CONFIG.ui.persistPosition && typeof GM_getValue !== 'undefined') {
                const saved = GM_getValue('panelPos');
                if (saved) {
                    panel.style.left = saved.left;
                    panel.style.top = saved.top;
                    // Ensure valid
                    if (parseInt(saved.top) > window.innerHeight) panel.style.top = '10px';
                    if (parseInt(saved.left) > window.innerWidth) panel.style.left = '10px';
                }
            }

            let dragging = false, startX, startY, initL, initT;
            handle.onmousedown = (e) => {
                if (e.target.closest('.uadbp-hdr-btn')) return;
                dragging = true; startX = e.clientX; startY = e.clientY;
                initL = panel.offsetLeft; initT = panel.offsetTop;
                panel.style.transition = 'none'; e.preventDefault();
            };
            document.onmousemove = (e) => {
                if (!dragging) return;
                panel.style.left = Math.max(0, Math.min(initL + e.clientX - startX, window.innerWidth - 100)) + 'px';
                panel.style.top = Math.max(0, Math.min(initT + e.clientY - startY, window.innerHeight - 50)) + 'px';
            };
            document.onmouseup = () => {
                dragging = false;
                panel.style.transition = '';
                if (CONFIG.ui.persistPosition && typeof GM_setValue !== 'undefined') {
                    GM_setValue('panelPos', { left: panel.style.left, top: panel.style.top });
                }
            };
        }

        bindHotkeys() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey) {
                    const k = e.key.toLowerCase();
                    const prevent = () => { e.preventDefault(); e.stopPropagation(); };

                    if (k === CONFIG.hotkeys.togglePanel.toLowerCase()) { prevent(); this.toggleVisibility(); }
                    if (k === CONFIG.hotkeys.forceScan.toLowerCase()) { prevent(); mediaCapture.scanDOM(); this.updateUI(); }
                    if (k === CONFIG.hotkeys.downloadBest.toLowerCase()) { prevent(); this.downloadBest(); }
                    if (k === CONFIG.hotkeys.togglePlayer.toLowerCase()) { prevent(); this.playBest(); } // Alt+P
                    if (k === CONFIG.hotkeys.screenshot.toLowerCase()) { prevent(); videoPlayer.takeScreenshot(); } // Alt+C

                    if (k === 'm') { prevent(); this.panel?.classList.toggle('minimized'); } // Alt+M
                    if (k === 'f') { prevent(); document.getElementById('uadbp-search')?.focus(); } // Alt+F
                }

                if (e.key === 'Escape') { this.closeModal(); videoPlayer.close(); }
            });
        }

        setupEventListeners() {
            Events.on('media-update', () => this.updateUI());
            Events.on('stats-update', (s) => this.updateStats(s));
            Events.on('log', () => this.updateLogs());
            Events.on('download-progress', (d) => this.updateProgress(d));

            // (NEW) Fullscreen re-parenting for menu visibility
            const handleFullscreen = () => {
                const fs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
                if (fs && this.panel) {
                    fs.appendChild(this.panel);
                    this.panel.style.position = 'fixed'; // Ensure it stays fixed
                    this.panel.style.zIndex = '2147483647';
                } else if (this.panel) {
                    document.body.appendChild(this.panel);
                }
            };
            document.addEventListener('fullscreenchange', handleFullscreen);
            document.addEventListener('webkitfullscreenchange', handleFullscreen);
            document.addEventListener('mozfullscreenchange', handleFullscreen);
            Events.on('download-started', () => {
                document.getElementById('uadbp-progress')?.classList.add('active');
                document.getElementById('uadbp-dl-cancel').style.display = 'block';
                document.getElementById('uadbp-dl-pause').style.display = 'block';
            });
            const hideDl = () => {
                document.getElementById('uadbp-progress')?.classList.remove('active');
                document.getElementById('uadbp-dl-cancel').style.display = 'none';
                document.getElementById('uadbp-dl-pause').style.display = 'none';
                document.getElementById('uadbp-dl-pause').textContent = '⏸️ Pause';
            };
            Events.on('download-completed', hideDl);
            Events.on('download-error', hideDl);
            Events.on('download-cancelled', hideDl);
            Events.on('download-paused', () => document.getElementById('uadbp-dl-pause').textContent = '▶️ Resume');
            Events.on('download-resumed', () => document.getElementById('uadbp-dl-pause').textContent = '⏸️ Pause');
            Events.on('recording-started', () => this.updateMediaList());
            Events.on('recording-progress', Utils.throttle(() => this.updateMediaList(), 1500));
            Events.on('recording-completed', () => this.updateMediaList());
            Events.on('stream-record-start', () => {
                document.getElementById('uadbp-rec-status').style.display = 'inline-block';
                document.getElementById('uadbp-rec-screen').textContent = '⏹️ Stop Recording';
                document.getElementById('uadbp-rec-video').textContent = '⏹️ Stop Recording';
            });
            Events.on('stream-record-stop', () => {
                document.getElementById('uadbp-rec-status').style.display = 'none';
                document.getElementById('uadbp-rec-screen').textContent = '🎥 Record Screen';
                document.getElementById('uadbp-rec-video').textContent = '🎬 Record Video';
            });
        }

        registerMenuCommands() {
            if (typeof GM_registerMenuCommand === 'undefined') return;
            GM_registerMenuCommand('⚙️ Toggle Panel', () => this.toggleVisibility());
            GM_registerMenuCommand('🔄 Reset Panel Position', () => { this.panel.style.top = '10px'; this.panel.style.left = '10px'; });
            GM_registerMenuCommand('📥 Download Best HLS', () => this.downloadBest());
            GM_registerMenuCommand('🔍 Force Scan', () => { mediaCapture.scanDOM(); this.updateUI(); });
        }

        showTab(name) {
            this.activeTab = name;
            this.panel?.querySelectorAll('.uadbp-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
            this.panel?.querySelectorAll('.uadbp-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === name));
        }

        toggleVisibility() {
            this.visible = !this.visible;
            this.panel?.classList.toggle('hidden', !this.visible);
            this.floatBtn?.classList.toggle('show', !this.visible && mediaCapture.getList().length > 0);
        }

        updateUI() {
            const list = mediaCapture.getList();
            const count = list.length;
            const stats = logger.getStats();
            document.getElementById('uadbp-s-cap').textContent = count;
            document.getElementById('uadbp-s-byp').textContent = stats.bypasses;
            document.getElementById('uadbp-s-dl').textContent = stats.downloads;
            document.getElementById('uadbp-s-err').textContent = stats.errors;
            document.getElementById('uadbp-s-req').textContent = STATE.networkStats.requests;
            document.getElementById('uadbp-s-data').textContent = Utils.formatBytes(STATE.networkStats.bytesIn);
            document.getElementById('uadbp-count').textContent = count;
            document.getElementById('uadbp-count-tab').textContent = count > 0 ? `(${count})` : '';
            const badge = document.getElementById('uadbp-badge');
            if (badge) { badge.textContent = count; badge.classList.toggle('show', count > 0); }
            this.updateMediaList();
        }

        updateStats(s) {
            document.getElementById('uadbp-s-byp').textContent = s.bypasses;
            document.getElementById('uadbp-s-dl').textContent = s.downloads;
            document.getElementById('uadbp-s-err').textContent = s.errors;
        }

        updateMediaList() {
            const container = document.getElementById('uadbp-media-list');
            if (!container) return;
            const search = document.getElementById('uadbp-search')?.value.toLowerCase() || '';
            const list = mediaCapture.getList().filter(m => !search || m.url.toLowerCase().includes(search));
            if (list.length === 0) {
                container.innerHTML = this.createTrustedHTML('<div class="uadbp-empty"><div class="uadbp-empty-icon">📡</div><div>No media captured</div></div>');
                return;
            }
            container.innerHTML = this.createTrustedHTML(list.map(m => `
                <div class="uadbp-media-item ${m.type.toLowerCase()}" data-url="${m.url}">
                    <div class="uadbp-media-tags">
                        <span class="uadbp-tag uadbp-tag-${m.type.toLowerCase()}">${m.type}</span>
                        <span class="uadbp-tag uadbp-tag-quality">${m.quality}</span>
                        ${m.drm && m.drm.protected ? `<span class="uadbp-tag" style="background:#ff4444;color:#fff">🔒 ${m.drm.type}</span>` : ''}
                    </div>
                    <div class="uadbp-media-url" title="Click to copy">${m.url.length > 70 ? m.url.substring(0, 70) + '...' : m.url}</div>
                    <div class="uadbp-media-actions">
                        <button class="uadbp-media-btn" data-action="copy">📋</button>
                        ${['HLS', 'DASH', 'CDN_STREAM'].includes(m.type) ? '<button class="uadbp-media-btn" data-action="download">⬇️</button>' : ''}
                        ${hlsDownloader.isRecording(m.url) ? `<button class="uadbp-media-btn uadbp-btn-danger" data-action="stop-rec" data-id="${hlsDownloader.isRecording(m.url).id}">⏹️ ${Utils.formatBytes(hlsDownloader.isRecording(m.url).totalBytes)}</button>` : (m.type === 'HLS' ? '<button class="uadbp-media-btn uadbp-btn-danger" data-action="record">🔴</button>' : '')}
                        <button class="uadbp-media-btn" data-action="play">▶️</button>
                        <button class="uadbp-media-btn" data-action="commands">🔧</button>
                    </div>
                </div>`).join(''));
            container.querySelectorAll('.uadbp-media-url').forEach(el => el.onclick = () => this.copyToClipboard(el.closest('.uadbp-media-item').dataset.url));
            container.querySelectorAll('.uadbp-media-btn').forEach(btn => btn.onclick = () => {
                const url = btn.closest('.uadbp-media-item').dataset.url;
                const action = btn.dataset.action;
                if (action === 'copy') this.copyToClipboard(url);
                if (action === 'download') this.startDownload(url);
                if (action === 'record') hlsDownloader.startRecording(url);
                if (action === 'stop-rec') hlsDownloader.stopRecording(btn.dataset.id);
                if (action === 'play') this.playUrl(url);
                if (action === 'commands') this.showCommands(url);
            });
        }

        updateLogs() {
            const container = document.getElementById('uadbp-logs');
            if (!container) return;
            const history = logger.getHistory().slice(0, 50);
            container.innerHTML = this.createTrustedHTML(history.map(e => `<div class="uadbp-log uadbp-log-${e.level}">${e.message}</div>`).join('') || '<div class="uadbp-log uadbp-log-info">No logs</div>');
        }

        updateProgress(d) {
            document.getElementById('uadbp-prog-fill').style.width = d.progress.percent + '%';
            document.getElementById('uadbp-prog-text').textContent = `${d.progress.percent}% - ${d.progress.current} /${d.progress.total} segments - ${Utils.formatBytes(d.progress.bytes)} @ ${Utils.formatBytes(d.progress.speed)}/s`;
        }

        filterMedia() { this.updateMediaList(); }

        async downloadBest() {
            const btn = document.getElementById('uadbp-dl-best');
            if (!btn) return;

            btn.disabled = true;
            btn.innerHTML = '⬇️ Downloading...';

            try {
                const hls = mediaCapture.getByType('HLS');
                if (hls.length === 0) {
                    Utils.notify('No HLS streams found', 'warning');
                    logger.log('No HLS streams found', 'warning');
                    return;
                }
                await this.startDownload(hls[0].url);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '⬇️ Download Best HLS';
            }
        }

        async startDownload(url) {
            const download = hlsDownloader.createDownload(url);
            this.currentDownloadId = download.id;
            this.showTab('download');
            try { await hlsDownloader.startDownload(download.id); } catch (e) { }
        }

        playBest() {
            const list = mediaCapture.getList();
            if (list.length === 0) { Utils.notify('No media found', 'warning'); logger.log('No media found', 'warning'); return; }
            const best = list.find(m => m.type === 'HLS') || list[0];
            this.playUrl(best.url);
        }

        playUrl(url) {
            videoPlayer.play(url, { onDownload: (u) => this.startDownload(u), onCommands: (u) => this.showCommands(u) });
        }

        async showQualityModal() {
            const hls = mediaCapture.getByType('HLS');
            if (hls.length === 0) { Utils.notify('No HLS streams found', 'warning'); logger.log('No HLS streams found', 'warning'); return; }
            try {
                const { qualities } = await hlsDownloader.getQualities(hls[0].url);
                if (qualities.length <= 1) { this.startDownload(hls[0].url); return; }
                this.showModal('🎬 Select Quality', this.createTrustedHTML(`<div style="display:flex;flex-direction:column;gap:6px;">
                ${qualities.map((q, i) => `<button class="uadbp-btn uadbp-btn-secondary" data-url="${q.url}">${q.resolution} (${Utils.formatBytes(q.bandwidth)}/s)</button>`).join('')}
                </div>`));
                document.querySelectorAll('.uadbp-modal-body button').forEach(b => b.onclick = () => { this.closeModal(); this.startDownload(b.dataset.url); });
            } catch (e) { this.startDownload(hls[0].url); }
        }

        showCommands(url) {
            const curl = headerManager.generateCurl(url);
            const ffmpeg = headerManager.generateFFmpeg(url);
            const ytdlp = headerManager.generateYtDlp(url);
            const aria2 = headerManager.generateAria2(url);
            const nm3u8dl = headerManager.generateN_m3u8DL(url);

            this.showModal('🔧 Download Commands', this.createTrustedHTML(`
                <div style="margin-bottom:10px;font-size:9px;color:#888;word-break:break-all;">${url}</div>
                <div style="margin-bottom:6px;font-size:10px;color:#00ddff;">cURL</div><div class="uadbp-code">${this.escapeHtml(curl)}</div>
                <div style="margin-bottom:6px;font-size:10px;color:#00ddff;">FFmpeg</div><div class="uadbp-code">${this.escapeHtml(ffmpeg)}</div>
                <div style="margin-bottom:6px;font-size:10px;color:#00ddff;">yt-dlp</div><div class="uadbp-code">${this.escapeHtml(ytdlp)}</div>
                <div style="margin-bottom:6px;font-size:10px;color:#00ddff;">aria2c</div><div class="uadbp-code">${this.escapeHtml(aria2)}</div>
                <div style="margin-bottom:6px;font-size:10px;color:#00ddff;">N_m3u8DL-RE</div><div class="uadbp-code">${this.escapeHtml(nm3u8dl)}</div>
            `));
            document.querySelectorAll('.uadbp-code').forEach(c => c.onclick = () => this.copyToClipboard(c.textContent));
        }

        showExport(title, content) {
            this.showModal('📤 Export ' + title, this.createTrustedHTML(`<textarea class="uadbp-input" style="height:180px;font-family:monospace;font-size:9px;">${this.escapeHtml(content)}</textarea>`));
        }

        generateAllCurl() { return mediaCapture.getList().filter(m => m.type !== 'SEGMENT').map(m => headerManager.generateCurl(m.url)).join('\n\n'); }


        copyToClipboard(text) {
            if (typeof GM_setClipboard !== 'undefined') { GM_setClipboard(text); logger.log('Copied!', 'success'); }
            else navigator.clipboard.writeText(text).then(() => logger.log('Copied!', 'success')).catch(() => prompt('Copy:', text));
        }

        escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
    }

    const uiPanel = new UIPanel();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ██╗███╗   ██╗██╗████████╗
    // ██║████╗  ██║██║╚══██╔══╝
    // ██║██╔██╗ ██║██║   ██║   
    // ██║██║╚██╗██║██║   ██║   
    // ██║██║ ╚████║██║   ██║   
    // ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   
    // ═══════════════════════════════════════════════════════════════════════════════

    // Load saved configuration
    function loadConfig() {
        if (typeof GM_getValue === 'undefined') return;

        const safeParse = (key, def) => {
            try {
                const val = GM_getValue(key);
                return val ? JSON.parse(val) : def;
            } catch (e) {
                logger.log(`Config load error[${key}]: ${e.message} `, 'error');
                return def;
            }
        };

        const savedFeatures = safeParse('uadbp_config_features', {});
        const savedUI = safeParse('uadbp_config_ui', {});
        const savedDL = safeParse('uadbp_config_dl', {});
        const savedProxy = safeParse('uadbp_config_proxy', {});
        const savedStorage = safeParse('uadbp_config_storage', {});

        // Shallow merge to preserve new defaults
        if (savedFeatures && typeof savedFeatures === 'object') Object.assign(CONFIG.features, savedFeatures);
        if (savedUI && typeof savedUI === 'object') Object.assign(CONFIG.ui, savedUI);
        if (savedStorage && typeof savedStorage === 'object') Object.assign(CONFIG.storage, savedStorage);

        if (savedDL && typeof savedDL === 'object') {
            if (savedDL.maxConcurrent) CONFIG.download.maxConcurrent = parseInt(savedDL.maxConcurrent) || 8;
        }

        if (savedProxy && typeof savedProxy === 'object') {
            if (savedProxy.currentIndex !== undefined) CONFIG.proxy.currentIndex = parseInt(savedProxy.currentIndex) || 0;
            if (Array.isArray(savedProxy.servers)) CONFIG.proxy.servers = savedProxy.servers;
        }

        console.log('UADBP Config Loaded:', CONFIG);
    }

    function initialize() {
        if (STATE.initialized) return;
        loadConfig(); // (FIX) Load config before init
        STATE.initialized = true;

        try {
            // Enable anti-debug bypass
            const antiDebug = new AntiDebugBypass();
            antiDebug.enable();

            // Initialize media capture
            mediaCapture.init();

            // Initialize UI (main frame only)
            uiPanel.init();

            // Success Flags
            document.body.setAttribute('data-uadbp-status', 'ready');
            document.body.setAttribute('data-uadbp-version', CONFIG.version);

            // Final log
            logger.log(`🛡️ UADBP v${CONFIG.version} Enhanced Edition Initialized!`, 'success');

            // Expose for debugging
            window.UADBP = {
                CONFIG, STATE, Utils, logger, headerManager, mediaAnalyzer, proxyManager, hlsDownloader, mediaCapture, videoPlayer, uiPanel, Events,
                checkIntegrity: () => {
                    const checks = [
                        { name: 'Utils.generateId', status: typeof Utils.generateId === 'function' },
                        { name: 'Utils.fetchBinary', status: typeof Utils.fetchBinary === 'undefined' ? 'N/A' : 'OK' }, // fetchBinary is in ProxyManager
                        { name: 'ProxyManager.fetchBinary', status: typeof proxyManager.fetchBinary === 'function' },
                        { name: 'ProxyManager.fetchArrayBuffer', status: typeof proxyManager.fetchArrayBuffer === 'function' },
                        { name: 'HLSDownloader.pauseDownload', status: typeof hlsDownloader.pauseDownload === 'function' },
                        { name: 'VideoPlayer.play', status: typeof videoPlayer.play === 'function' },
                        { name: 'UIPanel.toggleVisibility', status: typeof uiPanel.toggleVisibility === 'function' }
                    ];
                    console.table(checks);
                    return checks.every(c => c.status === true || c.status === 'OK');
                }
            };

            console.log('%c🛡️ UADBP v16.0 Enhanced Edition Loaded Successfully', 'background:#003300;color:#00ff88;padding:10px;font-size:20px;border-radius:5px;font-weight:bold;');
            if (CONFIG.debug) console.log('Integrity Check Passed: All modules loaded.');
        } catch (e) {
            console.error('UADBP Init Error:', e);
            if (typeof logger !== 'undefined') logger.log('Init Fatal Error: ' + e.message, 'error');
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
