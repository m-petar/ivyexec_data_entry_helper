# ivyexec_data_entry_helper
Chrome extension
<br/>
<p>Helping to collect data from job advertisements on any company website, extract job function and specialty from its title as well as qualifications (expected years of experience as well as education) from job description. <br/> 
Also, it automates form filling of the extracted data on a specified ivyexec company account with a single keyboard button press. <br/> 
While not 100% accurate, it speeds up data collection, processing and form-filling for up to roughly 25%. </p>

<h3>Installation </h3>
<p>Download as a .zip file, then extract. <br/>
In Google Chrome navigate to Settings> More Tools> Extensions. <br/>
Enable Developer mode and click Load unpacked, then navigate to the location of unzipped extension folder and open it.</p> 

<h3>Usage </h3>
<p>Navigate to a desired web page containing job ad. Extension icon's badge reads 'Title' indicating that the extension is expecting job title to be selected. After selection press F1 to send data to extension.<br/>
Extension icon's badge will now change from "Title" to "C/T" (City/Text) indicating extension is expecting either a city name or a job description(text) to be selected.<br/> 
Select either city or job description and press F1 again and the script will automatically recognize which of the two has been selected, signaling in extension icon badge what is next to be selected: if city was previously selected badge reading "Text" will appear on the icon, and vice versa. <br/>
Make a 3rd selection of whatever was not already selected, be it city or job description, and press F1. <br/>
Now the extension icon will turn from white to green, indicating that the job was full loaded. Clicking on the icon will display a preview of everything the script has extracted from the raw collected data, such as education, years of experience etc. That is exactly what will be pasted to a form in the next step. <br/>
If, at any point during the data collection something was entered incorrectly, press F3 for the page to reload and to reset all the data already collected. <br/>
If a page is missing city information, after selecting job title and description make sure nothing is selected and press F4. This will enter an empty string as a city name thus completing data collection process. <br/>
Navigate to the corresponding company account on Ivyexec website, click 'Add new job' and press F2 for all the collected data to be pasted into the form. Extension icon will turn from green to white, indicating it is ready for next round of data collecting.
</p>
