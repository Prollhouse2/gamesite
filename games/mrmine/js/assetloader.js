class AssetLoader
{
    defaultEndpoint = "";
    maxSpriteSheetWidth = 4096;
    maxSpriteSheetHeight = 4096;

    totalAssets = 0;
    assetsLoaded = 0;
    assetQueue = [];
    allAssetsQueued = false;
    loadStartTime;

    verboseLogging = false;
    export = "";

    defaultImage;

    constructor()
    {
        this.generateDefaultImage(1, 1);
    }

    generateDefaultImage(width, height)
    {
        // Create a magenta rectangle to use in place of missing images
        this.defaultImage = new Image();
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        context.fillStyle = "#FF00FF";
        context.fillRect(0, 0, width, height);
        this.defaultImage.src = canvas.toDataURL();
        return this.defaultImage;
    }

    setEndpoint(endpoint)
    {
        this.defaultEndpoint = endpoint;
    }

    async loadAsset(assetSource, assetId, numFrames = 1, numColumns = 1, alreadyQueued = false, endpoint = null)
    {
        if(typeof (isMobile) != "undefined" && isMobile())
        {
            return;
        }
        if(typeof (assetSource) == "object")
        {
            if(typeof (isMobile) != "undefined" && isMobile() && assetSource["mobile"])
            {
                assetSource = assetSource["mobile"];
            }
            else
            {
                assetSource = assetSource["desktop"];
            }
        }
        if(this.totalAssets == 0)
        {
            this.loadStartTime = Date.now();
        }
        if(localStorage["debug_loadTinyAssets"] == "true")
        {
            // assetSource = "Shared/Assets/SuperMiners/purpa_portrait.webp";
        }
        ++this.totalAssets;
        this.assetQueue.push([assetSource, assetId]);
        //load method based on extension
        var extension = assetSource.split(".")[assetSource.split(".").length - 1].toLowerCase();
        switch(extension)
        {
            case "png":
            case "jpg":
            case "webp":
            case "gif":
                var newImg = new Image();
                newImg.crossOrigin = 'Anonymous';
                newImg.id = assetId;
                newImg.onload = function ()
                {
                    if(assetLoader.verboseLogging) console.log("[ASSETLOADER] LOADED " + assetSource);
                    // assetDataManager.getAssetData(this.id).init();
                    assetLoader.assetsLoaded++;
                    if(assetLoader.allAssetsQueued)
                    {
                        if(assetLoader.verboseLogging) console.log("[ASSETLOADER] LOADING: " + assetLoader.assetsLoaded + "/" + assetLoader.totalAssets + "(" + Math.floor(100 * assetLoader.assetsLoaded / assetLoader.totalAssets) + "%)");
                        if(assetLoader.assetQueue.length < 10 && assetLoader.assetQueue.length > 0)
                        {
                            // console.log("[ASSETLOADER] LAST " + assetLoader.assetQueue.length + " ASSETS:");
                            // console.log("[ASSETLOADER] " + assetLoader.assetQueue.toString());
                        }
                        else if(assetLoader.assetQueue.length == 0)
                        {
                            if(assetLoader.verboseLogging) console.log("[ASSETLOADER] FINISHED LOADING ASSETS (" + Math.round((Date.now() - assetLoader.loadStartTime) / 1000) + " seconds)");
                        }
                    }
                }
                newImg.onerror = function ()
                {
                    if(assetLoader.defaultEndpoint != "" && endpoint == null)
                    {
                        // Try loading from the web server directly rather than the CDN
                        assetLoader.loadAsset(assetSource, assetId, numFrames, numColumns, alreadyQueued, "");
                    }
                    else if(newImg.src != assetLoader.defaultImage.src)
                    {
                        // Use a generic placeholder image to avoid a complete crash
                        console.error("Failed to load image '" + newImg.src + "'");
                        newImg.src = assetLoader.defaultImage.src;
                    }
                }
                window[assetId] = newImg;
                // var newAssetData = new AssetData(newImg, numFrames, numColumns);
                // assetDataManager.addAssetData(newAssetData);
                if(this.verboseLogging) console.log("[ASSETLOADER] LOADING " + assetSource + " (." + extension + ")");
                // assetSource += "?v=" + version + buildLetter;
                var selectedEndpoint = endpoint;
                if(selectedEndpoint == null)
                {
                    selectedEndpoint = this.defaultEndpoint;
                }
                newImg.src = selectedEndpoint + assetSource;
                this.export += "<img id='" + assetId + "' src='" + selectedEndpoint + assetSource + "' style='display:none;'>";
                assetLoader.assetQueue.splice(0, 1);
                break;
        }
    }

    async loadWebm(assetSource, assetId, numFrames, quality = 1.0)
    {
        window[assetId] = new Image();

        let seekResolve;
        let videoBlob = await fetch(assetSource).then(r => r.blob());
        let videoObjectUrl = URL.createObjectURL(videoBlob);
        let video = document.createElement("video");
        video.src = videoObjectUrl;
        video.crossOrigin = "anonymous";
        await video.play();
        video.addEventListener("seeked", async () => {if(seekResolve) {seekResolve();} });

        while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2)
        {
            await new Promise(r => setTimeout(r, 1000));
        }

        var canvas = document.createElement('canvas');
        var packedOrientationDetails = this.getPackDetails(numFrames, video.videoWidth, video.videoHeight);
        if(!packedOrientationDetails.success)
        {
            console.error("ERROR WHEN PACKING " + assetId);
            return;
        }
        canvas.width = packedOrientationDetails.data.totalWidth;
        canvas.height = packedOrientationDetails.data.totalHeight;
        var ctx = canvas.getContext("2d");

        var duration = video.duration;
        var frameTime = numFrames / duration;
        for(var i = 0; i < numFrames; i++)
        {
            video.currentTime = (i + 0.5) * frameTime;
            video.play();
            await new Promise(r => (seekResolve = r));

            var row = Math.floor(i / packedOrientationDetails.data.numColumns);
            var column = Math.floor(i % packedOrientationDetails.data.numColumns);
            var drawX = column * video.videoWidth;
            var drawY = row * video.videoHeight;
            ctx.drawImage(video, drawX, drawY);
        }
        window[assetId].src = canvas.toDataURL('image/webp', quality);

        //set for garbage collection
        canvas = null;
        ctx = null;
        video = null;
        videoBlob = null;
    }

    generateWebmFromAsset(asset, frames)
    {
        var canvas = document.createElement('canvas');
        canvas.width = asset.width / frames;
        canvas.height = asset.height;
        var ctx = canvas.getContext("2d");

        var frameImageData = [];
        for(var i = 0; i < frames; i++)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(asset, i * asset.width / frames, 0, asset.width / frames, asset.height, 0, 0, canvas.width, canvas.height);
            var imageData = canvas.toDataURL("image/webp", 1);
            frameImageData.push(imageData);
            console.log(imageData);
        }

        /*var video = Whammy.fromImageArray(frameImageData, 1);
        var url = (window.webkitURL || window.URL).createObjectURL(video);

        var link = document.createElement("a");
        link.download = name;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);*/
    }

    getPackDetails(numFrames, frameWidth, frameHeight)
    {
        var maxColumns = Math.floor(this.maxSpriteSheetWidth / frameWidth);
        var maxRows = Math.floor(this.maxSpriteSheetHeight / frameHeight);
        var canFit = maxRows > 0 && maxColumns > 0;
        if(!canFit)
        {
            return {
                "success": false,
                "data": null
            };
        }
        else
        {
            var bestScore = Number.MAX_SAFE_INTEGER;
            var bestNumColumns = -1;
            var bestNumRows = -1;
            for(var numRows = 1; numRows <= maxRows; numRows++)
            {
                var numColumns = Math.ceil(numFrames / numRows);
                if(numColumns <= maxColumns)
                {
                    var sheetWidth = numColumns * frameWidth;
                    var sheetHeight = numRows * frameWidth;
                    var sheetArea = sheetWidth * sheetHeight;
                    if(sheetArea < bestScore)
                    {
                        bestScore = sheetArea;
                        bestNumColumns = numColumns;
                        bestNumRows = numRows;
                    }
                }
            }

            if(bestNumColumns == -1 || bestNumRows == -1)
            {
                return {
                    "success": false,
                    "data": null
                };
            }
            else
            {
                return {
                    "success": true,
                    "data": {
                        "numColumns": bestNumColumns,
                        "numRows": bestNumRows,
                        "totalWidth": bestNumColumns * frameWidth,
                        "totalHeight": bestNumRows * frameHeight,
                    }
                };
            }
        }
    }
}