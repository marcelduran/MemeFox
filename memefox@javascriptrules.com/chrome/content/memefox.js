var memeFox = {
    request: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function (req) {
            return function () {
                if (req.readyState < 4) {
                    return;
                }
                if (req.status === 200) {
                    callback(req.responseText);
                }
            }
        })(xhr);
        xhr.open('GET', url, true);
        xhr.send(null);
    },

    openURL: function (url) {
        var i, tab, browser, doc, loc,
            tabbrowser = gBrowser,
            tabs = tabbrowser.tabContainer.childNodes,
            len = tabs.length;

        for (i = 0; i < len; i += 1) {
            tab = tabs[i];
            try {
                browser = tabbrowser.getBrowserForTab(tab);
                if (browser) {
                    doc = browser.contentDocument;
                    loc = doc.location.toString();
                    if (loc === url) {
                        gBrowser.selectedTab = tab;
                        return;
                    }
                }
            } catch (ex) {
            }
        }

        // There is no tab. open new tab...
        tab = gBrowser.addTab(url, null, null);
        gBrowser.selectedTab = tab;
    },

    parseDashboard: function (res) {
        var matches, body, cnt, posts, i, len, post, p, j, lenP,
            output = '',
            reLogin = /<a href="(https:\/\/login\.yahoo\.com\/config\/login\?\.done[^>]+)">/im;

        // check for login
        matches = reLogin.exec(res);
        if (matches && matches[1]) {
            this.openURL(matches[1]);
            return;
        }

        // check for dashboard
        body = res.slice(res.indexOf('<body>') + 6, res.lastIndexOf('</body>'));
        if (body) {
            cnt = document.getElementById('post-content');
            cnt.setAttribute('value', body);
        } else {
            alert('none');
        }
        this.panelVisible = false;
    },

    load: function (e) {
        this.initialized = true;
        this.panelVisible = false;
    },

    togglePanel: function (e) {
        if (e.button === 0 && !this.panelVisible) {
            var panel = document.createElement('panel');
            panel.id = 'memefox-panel';
            panel.style.height = '600px';
            panel.style.width = '300px';

            var box = window.document.createElement('vbox');
            box.align = 'start';
            panel.appendChild(box);

            var desc = window.document.createElement('label');
            desc.setAttribute('id', 'post-content');
            desc.style.fontSize = '10px';
            desc.style.backgroundColor = 'yellow';
            desc.setAttribute('value', 'foobar');
            box.appendChild(desc);

            var sts = window.document.getElementById('status-bar');
            sts.parentNode.insertBefore(panel, sts);

            var button = document.getElementById('memefox-statusbar-button');
            panel.openPopup(button, "before_end", 0, 0, false, false);

            this.request('http://meme.yahoo.com/marcelduran/dashboard', this.parseDashboard);
        }
        this.panelVisible = !this.panelVisible;
    },

    openDashboard: function () {
        this.openURL('http://meme.yahoo.com/marcelduran/dashboard/');
    },

    togglePopup: function () {
        alert('togglePopup: not implemented yet');
    },

    updatePosts: function () {
        alert('updatePosts: not implemented yet');
    },

    markAllRead: function () {
        alert('markAllRead: not implemented yet');
    },

    showPreferences: function () {
        if (this.prefWindow) {
          this.prefWindow.focus();
          return true;
        }
        this.prefWindow = window.openDialog("chrome://memefox/content/preferences.xul", 
                                             "_blank",
                                             "chrome,resizable=no,dependent=yes");
        return true;
    }
};

window.addEventListener('load', function (e) {memeFox.load(e);}, false);
