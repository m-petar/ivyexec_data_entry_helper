# ivyexec_data_entry_helper
Chrome extension

Download as a .zip file, then extract. 
In Google Chrome navigate to Settings> More Tools> Extensions.
Enable Developer mode and click Load unpacked, then navigate to the location of unzipped extension folder and open it. 

Copy Google sheet url.
Click on extension icon next to browser address bar.
Paste url into Sheet Url field.
Select the dates and click on Generate Company List. 
This will generate a table containing companies' names and credentials. Only companies' accounts that have been posted into within the selected date range would be included in it.
Click generate report. 
Extension will then open https://www.ivyexec.com/employers/auth/login to execute the task.
The script will automatically log into each listed company account and browse through it creating a report containing how many jobs were posted into the company account for the selected date range and also sort those jobs according to their status. At the end you will be prompted to save a report in .csv file.
