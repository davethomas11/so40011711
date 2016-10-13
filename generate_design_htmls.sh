for i in $(seq 1 100); do 

	designNumber=$(printf %03d $i)

	echo "<html><head><title> Design pattern $designNumber </title>
<meta data-details=\"This design should show the basic homepage\" />
<meta data-status=\"Approved\" /></head></html>" > design/design-pattern-${designNumber}.html


done