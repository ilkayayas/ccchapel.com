﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using CCC.Models.App.Objects;

namespace CCC.Models.App.Items
{
    public partial class Item
    {
        /// <summary>
        /// An array of ACTION objects which define the action to take when the user clicks on this item. Most items will contain only one action.
        /// </summary>
        public IEnumerable<Actions.Action> Actions { get; set; }

        /// <summary>
        /// An array of IMAGE objects defining image resources for the item. If more than one image object is provided, the device will choose the image size which is most appropriate for the current visual context on that specific device.
        /// </summary>
        public IEnumerable<Image> Images { get; set; }

        /// <summary>
        /// Title string value displayed for this item.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Subtitle string value displayed for this item. The subtitle may or may not appear in the UI depending on the visual context for this item.
        /// </summary>
        public string Subtitle { get; set; }
    }
}