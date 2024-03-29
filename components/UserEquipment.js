function UserEquipment({  }) {
  return (
    <ScrollView horizontal={true}
    onScroll={handleScrollBottom}
    scrollEventThrottle={10}
    showsHorizontalScrollIndicator={false}
    >
        <View style={styles.scrollRow}>
            <View style={styles.scrollBottom}>
            {listTwo.map((item) => (
                
            ))}
            </View>
        </View>
    </ScrollView>  
    );
}

export default UserEquipment;

